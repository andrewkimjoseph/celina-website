## Goal

Make the "§ Try saying" section render on every tool detail page by adding an `examples` array to the 29 tools in `src/data/tools.ts` that currently don't define one. No JSX or type changes — the conditional render in `src/routes/tools.$category.$toolSlug.tsx` already handles this once data is present.

## Approach

For each tool, add 1–2 natural-language prompts that an end user would actually say to Celina, matched to the tool's `kind`, `inputs`, and `description`. Keep them concrete (real-sounding token symbols, IDs, addresses redacted as `0x…`) and consistent in voice with the existing 42 examples (imperative, conversational, short).

## Examples to add

**Mento FX / Uniswap**
- `estimate_mento_fx`: "Estimate gas to convert 100 USDm to EURm via Mento."
- `estimate_uniswap_swap`: "Estimate gas to swap 1000 G$ to USDT on Uniswap v4."

**Self (agent identity)**
- `verify_self_request`: "Verify this signed Self agent request from these headers."
- `check_self_registration`: "Check the status of my Self registration session."
- `get_self_identity`: "What's my Self agent identity and proof status?"
- `refresh_self_proof`: "Refresh my Self human proof."
- `deregister_self_agent`: "Deregister my Self agent."
- `sign_self_request`: "Sign a GET request to https://api.self.xyz/me as my Self agent."
- `authenticated_self_fetch`: "Fetch https://api.self.xyz/me with my Self agent credentials."

## Files

- `src/data/tools.ts` — add an `examples: [...]` line to each of the 29 tools above, placed after `returns` to match the existing convention.

## Verification

- Spot-check the build output and a couple of tool pages (e.g. `/tools/self/refresh-self-proof`, `/tools/self/verify-self-agent`) in the preview to confirm "§ Try saying" now renders.
