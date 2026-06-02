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

**Carbon DeFi (read)**
- `get_carbon_strategy`: "Show me Carbon strategy 1234."
- `explore_carbon_pair`: "Explore Carbon liquidity for USDC/USDT."
- `resolve_carbon_token`: "Resolve the USDC token on Carbon."
- `get_carbon_activity`: "Show recent Carbon trades for 0x…"
- `find_carbon_opportunities`: "Find discount buys on Carbon for USDC/USDT."
- `get_carbon_protocol_stats`: "What's Carbon's TVL and 7-day volume on Celo?"
- `get_carbon_price_history`: "Show 30-day price history for USDC/USDT on Carbon."
- `carbon_help`: "How does prepare_carbon_recurring_strategy work?"
- `carbon_learn`: "Explain how Carbon recurring strategies work."

**Carbon DeFi (write — prepare flows)**
- `prepare_carbon_range_order`: "Prepare a Carbon range buy of 500 USDC between 0.995 and 0.999 USDT."
- `prepare_carbon_concentrated_strategy`: "Prepare a concentrated USDC/USDT strategy centered at 1.000 with 0.2% width."
- `prepare_carbon_full_range_strategy`: "Prepare a full-range CELO/USDC Carbon strategy."
- `prepare_carbon_reprice_strategy`: "Reprice Carbon strategy 1234 to a new buy range."
- `prepare_carbon_edit_strategy`: "Edit Carbon strategy 1234's budgets and prices."
- `prepare_carbon_deposit_budget`: "Deposit 100 USDC into Carbon strategy 1234."
- `prepare_carbon_withdraw_budget`: "Withdraw 50 USDC from Carbon strategy 1234."
- `prepare_carbon_pause_strategy`: "Pause Carbon strategy 1234."
- `prepare_carbon_resume_strategy`: "Resume Carbon strategy 1234."
- `prepare_carbon_delete_strategy`: "Close Carbon strategy 1234 and withdraw funds."
- `prepare_carbon_trade`: "Swap 100 USDC to USDT against Carbon liquidity."

## Files

- `src/data/tools.ts` — add an `examples: [...]` line to each of the 29 tools above, placed after `returns` to match the existing convention.

## Verification

- Spot-check the build output and a couple of tool pages (e.g. `/tools/self/refresh-self-proof`, `/tools/carbon-defi/carbon-help`) in the preview to confirm "§ Try saying" now renders.
