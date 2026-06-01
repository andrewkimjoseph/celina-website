
## Goal

Add a new `/stats/offchain` sub-tab that mirrors the existing on-chain and package pages, populated from Amplitude Dashboard REST API data (off-chain read tool calls like `get_gooddollar_ubi_entitlement`, `get_carbon_strategies`, etc.).

## Approach

Amplitude's Dashboard REST API (`https://amplitude.com/api/2/events/segmentation`) returns pre-aggregated event counts by day. Auth is HTTP Basic with `AMPLITUDE_API_KEY:AMPLITUDE_SECRET_KEY`. We'll proxy it through a TanStack server function (same pattern as `src/lib/dune.functions.ts`) so the secret never reaches the browser, then cache the response client-side in a small Zustand store (matching `src/lib/stats-store.ts` / `npm-store.ts`).

## Steps

1. **Secrets** — add `AMPLITUDE_API_KEY` and `AMPLITUDE_SECRET_KEY` via the secrets tool. Also need the Amplitude **project region** (US vs EU — different base URL: `amplitude.com` vs `analytics.eu.amplitude.com`). Confirm with you, then hardcode the right base.

2. **Server function** — `src/lib/amplitude.functions.ts`:
   - `getAmplitudeStats()` server fn (GET).
   - Internally calls two Dashboard API queries against the last ~365 days:
     - `events/segmentation` grouped by day for **total off-chain tool calls** (filter: event_type is any of the read-tool event names, or use a wildcard "Any Active Event" if all events in the project are tool calls).
     - `events/list` + per-event `segmentation` (or a single `groupBy=event_type` query if the project tier allows) for **per-tool counts** over the same window.
   - Returns `{ daily: [{ day, count }], perTool: [{ event, count }], total, fetchedAt }`.
   - Uses `try/catch` and returns `{ data: ..., error: ... }` shape like the Dune fn so the UI degrades gracefully.

3. **Client store** — `src/lib/amplitude-store.ts`: mirror `npm-store.ts` (rows, fetchedAt, loading, error, refresh, `STALE_MS` reuse).

4. **Shared chart helpers** — extend `src/lib/stats-shared.tsx` with an `aggregateAmplitude(rows)` helper returning the shapes already used by the existing KPI/chart components (cumulative daily, top-N tools, last-7/30 totals).

5. **New route** — `src/routes/stats.offchain.tsx`:
   - KPI cards: total off-chain calls, last 7d, last 30d, today.
   - Daily line chart of off-chain call volume.
   - Horizontal bar chart of top 10 tools by call count.
   - Same visual language as `stats.onchain.tsx` / `stats.package.tsx`.
   - Own `head()` meta.

6. **Sub-nav + overview** — `src/routes/stats.tsx`: add `<SubNavLink to="/stats/offchain" label="Off-chain" />`. `src/routes/stats.index.tsx`: add a 3rd `SectionCard` for off-chain (and bump KPI grid to fit, e.g. 2 cols on mobile / 3-4 on desktop). Also wire `refreshAmplitude` into the parent layout's auto-refresh + manual refresh button + cooldown calculation (oldest of three `fetchedAt`s).

7. **Verify** — `invoke-server-function /` and check `server-function-logs` for the new fn; confirm KPIs render and match Amplitude dashboard counts.

## Technical notes

- Amplitude Dashboard API rate limit: 360 queries/hour per project, 7200/day. We refresh every 5 min (`STALE_MS`) — well within limits.
- The events shown in your screenshot (`get_gooddollar_ubi_entitlement`, `get_carbon_strategies`, `resolve_ens`, etc.) match tool names in `src/data/tools.ts` — we'll filter to `kind: "read"` tools when computing per-tool charts, or just trust Amplitude to return whatever events exist.
- No changes to `src/data/tools.ts`, `/`, or `/tools/*` — purely a stats addition.

## Open question before I build

**Amplitude region**: is your project on US (`amplitude.com`) or EU (`analytics.eu.amplitude.com`)? I'll default to US if you don't specify.
