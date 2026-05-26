## Goal
Restructure `/stats` into a hub with two dedicated sub-routes — `/stats/onchain` and `/stats/package` — and rename the main title to "Celina stats" with subtopic headings.

## New route structure

```text
/stats           → overview hub (summary KPIs from both + links to sub-pages)
/stats/onchain   → Dune on-chain charts + transactions table
/stats/package   → npm download charts
```

## File changes

### 1. `src/routes/stats.tsx` (refactor into layout)
- Convert into a layout route: header (nav + theme toggle), hero ("Celina stats" h1 + tagline), shared Refresh button (refreshes both stores), shared error banner, sub-nav tabs (Overview / On-chain / Package), and `<Outlet />` for child routes. Footer stays here.
- Keep the 5-min cooldown and dual-store refresh logic in the layout so it works on every sub-page.

### 2. `src/routes/stats.index.tsx` (new — overview)
- Renders at `/stats`. Shows a condensed summary: top KPI row mixing on-chain (Total txns, Today) and npm (Total 365d, Last 7d) plus two hero links/cards routing to the sub-pages with a one-line preview chart each (cumulative tx + daily downloads).

### 3. `src/routes/stats.onchain.tsx` (new)
- Section subtitle "On-chain activity · Dune Analytics".
- Moves the existing on-chain KPI grid, all 6 Recharts charts, and the Transactions table here.

### 4. `src/routes/stats.package.tsx` (new)
- Section subtitle "Package adoption · npm downloads".
- Moves the npm KPI grid and 4 npm charts here. Keeps the "npm-stat.com" external link.

### 5. Extract shared helpers → `src/lib/stats-shared.tsx` (new)
- Move `ChartCard`, `KpiCard`, `tooltipStyle`, `truncate`, `formatDateTime`, `formatDateOnly`, `timeAgo`, `aggregate`, `aggregateNpm`, `isoWeek`, and `NPM_URL` here so all three route files can import them.

### 6. Navigation updates
- `src/routes/index.tsx`: header + footer "Stats" links continue to point to `/stats`.
- Sub-nav inside the stats layout uses `<Link to="/stats">`, `<Link to="/stats/onchain">`, `<Link to="/stats/package">` with active-state styling.

### 7. SEO
- Each route file gets its own `head()` with unique title + description + og tags:
  - `/stats` → "Celina stats"
  - `/stats/onchain` → "Celina stats — On-chain activity"
  - `/stats/package` → "Celina stats — Package downloads"

## Notes
- Both Zustand stores (`useStatsStore`, `useNpmStore`) already cache + persist, so navigating between sub-routes is instant — no extra fetches.
- `routeTree.gen.ts` regenerates automatically; do not edit it by hand.