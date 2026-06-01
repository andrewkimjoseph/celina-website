# Off-chain stats → Amplitude Export API + custom Supabase

## Goal

Replace the segmentation-based pipeline with Amplitude's **Export API** so we capture **every** event (no taxonomy lag, no `Invalid chart definition` 400s on new tools). Persist rolled-up daily counts in your Supabase so the page stays fast and we don't re-pull the same hours twice.

Window: last 90 days (data effectively starts Mon 1 Jun 2026 since that's when Amplitude logging was wired up).

## What you'll do (one-time)

1. Connect your Supabase project to this Lovable project (Lovable Cloud → "Connect existing Supabase"). I'll list the secret names I need after you connect.
2. Confirm Amplitude region (`us` / `eu`) — I'll default to whatever `AMPLITUDE_REGION` is currently set to.

## What I'll build

### 1. Supabase schema (migration)

Two small tables in `public`:

```text
amplitude_daily_event_counts
  day          date         not null
  event_type   text         not null
  count        integer      not null default 0
  PRIMARY KEY (day, event_type)

amplitude_sync_state
  id              int         primary key default 1   -- single row
  last_synced_at  timestamptz not null                -- rounded down to the hour
  updated_at      timestamptz not null default now()
```

RLS: enabled on both. No `anon` / `authenticated` policies — only `service_role` reads/writes them (the server fn uses the admin client). Public read happens via a server fn that re-shapes the rows, so no PII risk (there's no PII anyway, just event counts).

Seed `amplitude_sync_state` with `last_synced_at = '2026-06-01T00:00:00Z'` so the very first pull covers the integration day.

### 2. Server function: `syncAmplitudeExport` (`src/lib/amplitude.functions.ts`)

- Reads `last_synced_at` from Supabase.
- If `now - last_synced_at < 5 min` → no-op (cache gate).
- Otherwise calls **`GET /api/2/export?start=YYYYMMDDTHH&end=YYYYMMDDTHH`** with Basic auth (`AMPLITUDE_API_KEY:AMPLITUDE_SECRET_KEY`).
- Response is a **zip** of hourly `.json.gz` files, each containing NDJSON of raw events. We:
  - unzip in-Worker (`fflate` — already Worker-safe, no native deps),
  - gunzip each entry,
  - stream-parse NDJSON line-by-line,
  - bucket by `(event_time → UTC date, event_type)`,
  - **upsert into `amplitude_daily_event_counts`** using `ON CONFLICT (day, event_type) DO UPDATE SET count = excluded.count`.
- Because the upsert overwrites the whole `(day, event_type)` row, we always re-pull from the **start of the current day** (not from `last_synced_at`) — that way late-arriving events for today get reconciled. Older days are immutable, so we never re-fetch them.
- Updates `last_synced_at = now` on success.

Guardrails:
- Export API limit ~1 req/min and ~365-day max range → we only ever request `[max(today_00:00, last_synced_at), now]`, which is at most 24 h of data.
- If the unzipped payload exceeds ~50 MB we abort and log — won't happen at current volume but worth a fence.
- Errors are caught and surfaced via `{ error }` to the client store (same pattern as today).

### 3. Server function: `getAmplitudeStats` (rewritten)

- Calls `syncAmplitudeExport()` first (cheap if cached).
- Then `SELECT day, event_type, count FROM amplitude_daily_event_counts WHERE day >= now() - interval '90 days' ORDER BY day`.
- Aggregates server-side into the same `{ daily, perTool, total, fetchedAt, error }` shape the UI already consumes — **no UI changes needed**.

### 4. Client store (`src/lib/amplitude-store.ts`)

- Bump persist key to `celina-amplitude-v3` so stale browser cache from the segmentation era is dropped.
- No other changes — `refresh()` already gates on `STALE_MS` (5 min), matching the cache gate on the server.

### 5. Cleanup

- Drop `events/segmentation` and `events/list` code paths from `amplitude.functions.ts` (and the `knownEventNames` / `offchainEventNames` helpers).
- Remove the no-longer-needed taxonomy intersection.
- Keep `LOOKBACK_DAYS = 90` and the region helper.

## Secrets I'll need

After you connect your Supabase, I'll request these via the secrets tool (don't paste them in chat):
- `SUPABASE_URL` (your custom project URL)
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never shipped to the client)
- Existing: `AMPLITUDE_API_KEY`, `AMPLITUDE_SECRET_KEY`, optional `AMPLITUDE_REGION`

## Why this is the right shape

- **Complete data** — Export is the only Amplitude endpoint that includes every event without taxonomy registration.
- **Fast page loads** — UI reads from Postgres, not Amplitude (segmentation calls were ~3–8 s).
- **Cheap on Amplitude rate limit** — at most one Export pull per 5 min, only fetches the current day's slice after the initial backfill.
- **No new infra** — refresh trigger stays "on page load, gated by cache" as you chose; no cron, no public webhook endpoint, no signature verification surface.

## Open question

The Amplitude Export response is gzipped NDJSON inside a zip. Cloudflare Workers (where server fns run) have a ~128 MB memory ceiling per request. At your current ~7 events/day this is trivially fine, but if usage ever exploded to ~1 M events/day a single hourly file could approach 10–50 MB unzipped. I'll add a hard cap + clear error if that ever happens; do you want me to also add a per-day row count metric so we can see headroom in the UI?
