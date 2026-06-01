Sync `src/data/tools.ts` (and downstream UI counts) with the latest README. Frontend-only changes; no schema/backend work.

## 1. New tools to add (GoodDollar)

Append to `TOOLS` in `src/data/tools.ts`:

- `get_gooddollar_ubi_entitlement` — **read**, category **GoodDollar**
  - Summary: "Daily UBI claim eligibility (amount, root, reasons)"
  - Description: returns whether the address can claim today's G$ UBI, the claimable amount, whitelist root address, and any blocking reasons.
  - Inputs: `address` (0x… address, required)
  - Returns: `{ canClaim, claimableAmount, whitelistedRoot, reasons }`

- `claim_daily_gooddollar_ubi` — **write**, category **GoodDollar**
  - Summary: "Claim today's GoodDollar UBI (G$)"
  - Description: claims today's UBI to the MCP server wallet on Celo mainnet (G$ to signer, gas in CELO). Requires `CELO_PRIVATE_KEY`.
  - Inputs: none
  - Returns: `{ hash, status, amountClaimed, blockNumber }`

## 2. Existing tool descriptions to update

- `get_block` — add optional `includeTransactions` (boolean) input; mention it in description.
- `get_latest_blocks` — README now allows up to **100** blocks and adds an `offset` param. Update:
  - input `count` range → `1-100`
  - add input `offset` (integer, optional)
  - update description to reflect the new cap and pagination.

## 3. Downstream UI

No structural changes needed. Tool list / category pages derive counts from `TOOLS.length`, so:
- Total tool count goes from 56 → 58.
- GoodDollar category gains 2 tools (1 read + 1 write).

Verify visually on `/tools` and `/tools/gooddollar` after the edit.

## Out of scope

- README copy on `/` (already mentions Carbon DeFi, Mento FX, Uniswap v4, Aave).
- Hosted URL is already `https://mcp.usecelina.xyz/api/mcp` in `src/routes/index.tsx`.
- No re-classification of Carbon `prepare_*` tools (already `write` per your earlier correction).
- README.md file itself (per your selection: site copy & tool descriptions only).
