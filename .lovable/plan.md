## Goal

Reflect the new tools shipped in `@andrewkimjoseph/celina-mcp` v0.7 on the marketing site. The current catalog has 27 tools; the new spec has 41. Add the 14 missing ones with full docs, and introduce 4 new categories so they show up in `/tools` and `/tools/:category`.

## New tools to add (14)

Extend `src/data/tools.ts` with:

**Existing categories**
- `get_token_balance` — Token, read — ERC-20 balance by contract address
- `get_gas_fee_data` — Blockchain, read — current EIP-1559 gas fees
- `estimate_transaction` — Transaction, read — generic from/to/value/data gas estimate

**New category: Governance**
- `get_governance_proposals` — paginated list of Celo governance proposals
- `get_proposal_details` — single proposal + CGP content

**New category: Staking**
- `get_staking_balances` — staking votes by validator group for an address
- `get_activatable_stakes` — pending stakes ready to activate
- `get_validator_groups` — paginated validator groups
- `get_validator_group_details` — single group details
- `get_total_staking_info` — network-wide staking totals

**New category: NFT**
- `get_nft_info` — NFT token info + metadata
- `get_nft_balance` — ERC-721 / ERC-1155 balance

**New category: Contract**
- `call_contract_function` — read-only contract call with caller-supplied ABI
- `estimate_contract_gas` — gas estimate for a contract function call

## Implementation

1. **`src/data/tools.ts`**
   - Widen the `category` union to add `"Governance" | "Staking" | "NFT" | "Contract"`.
   - Append the 14 `ToolDoc` entries above with `name`, `slug`, `title`, `summary`, `description`, `kind`, `category`, `inputs`, `returns`, and 1–2 `examples` each — matching the existing style (concise summary, short input descriptions).

2. **No new routes needed.** `tools.$category.index.tsx` and `tools.$category.$toolSlug.tsx` already render any category dynamically via `categorySlug()` / `CATEGORY_BY_SLUG`, so the new categories auto-appear on `/tools` and get their own pages.

3. **Light copy touch-ups**
   - `tools.index.tsx` heading/meta description currently uses `TOOLS.length` and lists "Mento FX, Aave and GoodDollar" — extend the meta `desc` to also mention Governance/Staking/NFT so it reflects the new surface (counts update automatically).

## Out of scope

- No changes to stats, npm fetching, or landing page (already updated to `celina-mcp` in the previous turn).
- No changes to `README.md` in this repo unless you want me to also refresh it to the v0.7 tool table — say the word and I'll include it.
