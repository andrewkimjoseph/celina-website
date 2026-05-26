## Goal
Add npm download charts to `/stats` so visitors can see how `@andrewkimjoseph/celina` is performing on npm — same data source npm-stat.com uses (the public npm downloads API).

## Data source
`https://api.npmjs.org/downloads/range/{start}:{end}/@andrewkimjoseph/celina` — returns `{ downloads: [{ day, downloads }], start, end, package }`. Public, no key required, CORS-enabled. Fetch last 365 days.

## Changes

### 1. `src/lib/npm.functions.ts` (new)
- `getNpmDownloads` server function (`createServerFn`, GET) that fetches the last 365 days for `@andrewkimjoseph/celina` and returns `{ rows: { day: string; downloads: number }[], fetchedAt: number, error: string | null }`.
- Server-side fetch keeps the contract identical to the Dune one and centralizes error handling.

### 2. `src/lib/npm-store.ts` (new)
- Zustand `useNpmStore` with the same shape and 5-minute cooldown as `useStatsStore` (reuses `STALE_MS`). Persists to localStorage under `celina-npm`.

### 3. `src/routes/stats.tsx`
- Call `useNpmStore` alongside `useStatsStore`; trigger its `refresh()` on the same mount effect and the same 5-minute interval; share the cooldown countdown (use `Math.min` of the two `fetchedAt`s so the refresh button reflects whichever is closest to ready).
- Single Refresh button refreshes both stores; error banner shows either error.
- New "npm downloads" section (above the transactions table) with:
  - **KPI row**: Total (last 365d), Last 7 days, Last 30 days, Avg/day (30d).
  - **Charts** (2-column on lg, same `ChartCard` styling):
    - Daily downloads (bar, last 90 days slice for readability).
    - Cumulative downloads (line, full year).
    - Weekly downloads (bar, aggregated by ISO week, full year).
    - Monthly downloads (bar, aggregated by year-month, full year).
  - A small "View on npm-stat.com" link → `https://npm-stat.com/charts.html?package=@andrewkimjoseph/celina`.

### 4. Section header tweak
- Rename the existing on-chain section heading area to make room: add a section divider/title "npm downloads" before the new charts so the page reads: on-chain KPIs → on-chain charts → npm KPIs → npm charts → transactions table.

## Notes
- All colors via existing tokens (`--celo-yellow`, `--celo-forest`).
- No Cloud / no secret needed — npm downloads API is public.
- Reuse existing `ChartCard`, `KpiCard`, `tooltipStyle`, and date helpers.