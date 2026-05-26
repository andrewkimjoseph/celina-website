
## Goal

Add a Stats page powered by the Dune Analytics query for the CELINA tag, with charts and a transactions table linking out to Celoscan. Cache results client-side via a persisted zustand store; keep the Dune API key server-side.

## Steps

### 1. Secret + dependencies
- Add `DUNE_API_KEY` via the secrets tool (used by a TanStack server function — not a Cloud/Supabase integration).
- Install `zustand` and `recharts` (recharts already used by `src/components/ui/chart.tsx`, verify and skip if present).

### 2. Server function — `src/lib/dune.functions.ts`
- `getCelinaStats` = `createServerFn({ method: "GET" })` that uses plain `fetch` to call:
  `https://api.dune.com/api/v1/query/7576390/results` with header `X-Dune-API-Key: process.env.DUNE_API_KEY`.
- Parse `result.rows` into a typed `CelinaTxRow[]` (`day`, `txn_count`, `cumulative_txns`, `hash`, `block_time`, `block_number`, `from`, `to`).
- Return a serializable DTO `{ rows, fetchedAt, error }` with graceful error fallback.

### 3. Zustand store — `src/lib/stats-store.ts`
- `useStatsStore` with `rows`, `fetchedAt`, `loading`, `error`, plus `refresh()` action that calls the server function.
- Use `persist` middleware (localStorage, key `celina-stats`) so the chart loads instantly on revisit and only refetches in the background.

### 4. Route — `src/routes/stats.tsx`
- `createFileRoute("/stats")` with `head()` (title, description, og tags).
- On mount: read from store; trigger `refresh()` if data is stale (>5 min) or empty.
- Layout (single column, semantic tokens from `src/styles.css`, matching existing landing aesthetic):
  - Header: "Celina on-chain stats" + last-updated timestamp + manual Refresh button.
  - KPI cards: total transactions (max cumulative), transactions today, unique receivers, unique senders, days active.
  - Charts (Recharts via existing `ChartContainer`):
    - Daily transactions — bar chart (`day` vs `txn_count`, dedup per day).
    - Cumulative growth — area/line chart (`day` vs `cumulative_txns`).
    - Hourly activity — bar chart bucketed from `block_time`.
    - Top receivers (`to`) — horizontal bar chart, top 8 with truncated addresses.
    - Top senders (`from`) — horizontal bar chart, top 8.
  - Transactions table: hash (mono, truncated, link `https://celoscan.io/tx/{hash}` in new tab with external-link icon), block time, block number, from→to (truncated, link to `https://celoscan.io/address/{addr}`). Paginated client-side (e.g., 25 per page) or "Load more".
- Loading skeleton + error state.

### 5. Navigation
- Add "Stats" link to the header nav and footer in `src/routes/index.tsx` / shared layout (whichever holds current nav).

### 6. Verification
- Typecheck clean.
- Visit `/stats` in preview, confirm charts render and Celoscan links open correctly.

## Technical notes
- Server fn isolates the key; the browser only receives row data.
- Persisted store avoids refetch on every navigation; `refresh()` runs in background with a staleness check.
- All colors via design tokens (`--primary`, `--muted`, `--accent`) — no hardcoded hex.
- Address/hash truncation helper: `0xabcd…1234`.
