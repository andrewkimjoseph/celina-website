## Goal

Add the 25 new Carbon DeFi tools to the site catalog and update the hero/category copy so the marketing site matches the new MCP server description (Mento FX, Uniswap v4, Aave, **Carbon DeFi**, chain reads).

## Scope

Frontend / data only. No backend, no schema, no stats logic changes.

## 1. `src/data/tools.ts`

- Extend the `ToolDoc.category` union with `"Carbon DeFi"`.
- Add a new `ToolKind` value `"prepare"` (used by 13 of the 25 Carbon tools). Keep `read` and `write` for the rest.
  - Update any place that branches on `kind === "write"` (tool list card, category page, tool detail page) to treat `prepare` distinctly — render a third badge ("prepare") styled like write but in a softer tone so users can see it's unsigned.
- Append 25 new tool entries under category `Carbon DeFi`, each with: `name`, `slug` (kebab-case), `title`, `summary`, `description`, `kind`, `inputs` (minimal — most take a wallet + pair + amount/price params), `returns`, and 1–2 example prompts where natural.
  - 12 reads: `get_carbon_strategies`, `get_carbon_strategy`, `get_carbon_trade_quote`, `explore_carbon_pair`, `resolve_carbon_token`, `get_carbon_activity`, `find_carbon_opportunities`, `get_carbon_protocol_stats`, `get_carbon_price_history`, `simulate_carbon_strategy`, `carbon_help`, `carbon_learn`
  - 13 prepares: `prepare_carbon_limit_order`, `prepare_carbon_range_order`, `prepare_carbon_recurring_strategy`, `prepare_carbon_concentrated_strategy`, `prepare_carbon_full_range_strategy`, `prepare_carbon_reprice_strategy`, `prepare_carbon_edit_strategy`, `prepare_carbon_deposit_budget`, `prepare_carbon_withdraw_budget`, `prepare_carbon_pause_strategy`, `prepare_carbon_resume_strategy`, `prepare_carbon_delete_strategy`, `prepare_carbon_trade`
- Make sure `CATEGORY_BY_SLUG` (categorySlug helper) handles `"Carbon DeFi"` → `carbon-defi`.

## 2. Tool detail / category badges

- `src/routes/tools.$category.$toolSlug.tsx`, `src/routes/tools.$category.index.tsx`, `src/routes/tools.index.tsx`: extend the read/write badge logic to a small helper that returns label + colors for `read | write | prepare`. Use yellow for write, forest for read (current), and a neutral border style for prepare.
- Tool detail page: when `kind === "prepare"`, add a one-line note: "Returns an unsigned prepared flow — user signs in their wallet. Local stdio only."

## 3. Landing copy (`src/routes/index.tsx`)

- Hero subtitle: extend the sentence already mentioning Mento FX, Uniswap v4, Aave to include "Carbon DeFi maker/taker tools".
- Hosted section caveat: append "`prepare_carbon_*` tools are local-stdio only" next to the existing write-disabled line.
- Tool counts use `TOOLS.length` already — auto-updates from 31 → 56.

## 4. README (already updated by user) — no change

## 5. Header / nav

- `src/components/site-header.tsx`: if there's a category dropdown, add Carbon DeFi. Otherwise no change (categories are derived from TOOLS).

## Out of scope

- `/stats` and `/sdk` routes — no Carbon-specific metrics.
- Color tokens — reuse existing `--celo-*` tokens; no new tokens needed.

## Verification

- Build passes (route tree regenerates cleanly).
- `/tools` shows new Carbon DeFi category with 25 tools.
- `/tools/carbon-defi` lists all 25; each detail page renders.
- Hero count reads "56 tools" (or current total).
