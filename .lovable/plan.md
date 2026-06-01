## Goal

Stop storing only daily roll-ups. Persist every Amplitude event as its own row, then derive the daily / per-tool / future drill-down views from that table.

## New table (you run the SQL on the custom Supabase project)

```sql
create table if not exists public.amplitude_events (
  insert_id      text primary key,           -- Amplitude's $insert_id; dedupes re-pulls
  event_time     timestamptz not null,
  event_day      date generated always as ((event_time at time zone 'UTC')::date) stored,
  event_type     text not null,
  user_id        text,
  device_id      text,
  session_id     bigint,
  amplitude_id   bigint,
  app            text,
  platform       text,
  country        text,
  region         text,
  city           text,
  os_name        text,
  device_family  text,
  library        text,
  event_properties jsonb,
  user_properties  jsonb,
  raw            jsonb not null,
  ingested_at    timestamptz not null default now()
);

create index if not exists amplitude_events_day_idx        on public.amplitude_events (event_day);
create index if not exists amplitude_events_type_idx       on public.amplitude_events (event_type);
create index if not exists amplitude_events_day_type_idx   on public.amplitude_events (event_day, event_type);
create index if not exists amplitude_events_time_idx       on public.amplitude_events (event_time desc);

alter table public.amplitude_events enable row level security;
-- service role bypasses RLS; no public policy needed (server fn uses service key)
```

The existing `amplitude_daily_event_counts` and `amplitude_sync_state` tables stay — `sync_state` still tracks the last pull cursor; the daily-counts table is kept as a fast aggregate cache (optional).

## Sync changes (`src/lib/amplitude.functions.ts`)

1. Expand `RawEvent` to capture the fields above (especially `$insert_id`, `event_time`, `event_type`, user/device IDs, geo, props, and keep the original line as `raw`).
2. In `syncAmplitudeExport`:
   - After `pullExport(...)`, batch-insert all events into `amplitude_events` via PostgREST with `Prefer: resolution=merge-duplicates,return=minimal` and `on_conflict=insert_id`. This naturally dedupes when we re-pull today's hours.
   - Chunk inserts (e.g. 500 rows per request) to stay within PostgREST payload limits.
   - Still update `amplitude_sync_state.last_synced_at` at the end.
3. Replace the delete-then-reinsert flow on `amplitude_daily_event_counts`. Either:
   - drop that table entirely and compute aggregates from `amplitude_events`, OR
   - keep it as a materialized cache rebuilt from the touched days (`insert ... select day, event_type, count(*) from amplitude_events where event_day in (...) group by ...` after `delete`).
   Recommend option A for simplicity now that per-event data is the source of truth.

## Read path

Rewrite the read in `getAmplitudeStats` to query `amplitude_events` directly:

- `daily`: `select event_day as day, count(*) from amplitude_events where event_day >= :since group by event_day order by event_day`.
- `perTool`: `select event_type as event, count(*) from amplitude_events where event_day >= :since group by event_type order by count desc`.

PostgREST doesn't do `group by` natively, so add two SQL views (`amplitude_daily_totals`, `amplitude_tool_totals`) and `select` from them, OR expose a Postgres function callable via `/rest/v1/rpc/...`. Views are simpler:

```sql
create or replace view public.amplitude_daily_totals as
  select event_day as day, count(*)::int as count
  from public.amplitude_events
  group by event_day;

create or replace view public.amplitude_tool_totals as
  select event_type as event, count(*)::int as count
  from public.amplitude_events
  group by event_type;

grant select on public.amplitude_daily_totals, public.amplitude_tool_totals to service_role;
```

`getAmplitudeStats` then reads those views with a `day=gte.<sinceDay>` filter on the daily view.

## What stays the same

- All UI in `src/routes/stats.offchain.tsx` and the `aggregateAmplitude` helper — they keep consuming `{ daily, perTool }`, so no chart changes.
- Auth model (service-role key in server fn only).
- Cache gate (5 min) and the "always re-pull from start of UTC day" rule.

## What you unlock later (not in this PR)

- Drill-down route showing the last N raw events with timestamps, tool, user/device.
- Per-user / per-device counts, geo breakdowns — all just new views over `amplitude_events`.
- Independence: if Amplitude pulls fail, charts still render from whatever's in `amplitude_events`.

## Order of operations

1. You run the SQL above on the custom Supabase project (create table + indexes + views).
2. I update `amplitude.functions.ts` to insert per-event rows and read from the new views.
3. First sync after deploy backfills from `last_synced_at` forward; older daily roll-ups remain in `amplitude_daily_event_counts` but are no longer read. We can drop that table once you're happy.
