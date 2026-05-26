## Goal
Make every Dune data refresh on `/stats` respect a strict 5-minute cooldown — both automatic background refreshes and manual button clicks.

## Changes

### 1. `src/lib/stats-store.ts`
- Export `STALE_MS` so the UI can reference the same cooldown duration.

### 2. `src/routes/stats.tsx`
- **Auto-refresh interval:** Replace the one-time mount `useEffect` with a `setInterval` that calls `refresh()` (no `force`) every 5 minutes. Call once immediately on mount. Clean up on unmount.
- **Manual refresh button:** Remove `{ force: true }` so the button respects the same staleness guard.
- **Disabled state:** Disable the button and change its label to show remaining wait time (e.g. `Refresh in 3m`) when data is fresh.
- **Visual feedback:** Keep the existing loading spinner state; button stays disabled while `loading` is true.

## Rationale
This prevents API hammering, keeps data reasonably fresh for users who leave the tab open, and makes the 5-minute policy visible in the UI.