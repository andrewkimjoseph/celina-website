// Extracted from legacy tools.ts — rich returns, examples, summaries
import type { ToolDocOverride } from "./tools.types.js";

export const TOOL_OVERRIDES: Record<string, ToolDocOverride> = {
  "get_network_status": {
    "summary": "Chain ID, latest block, gas price",
    "description": "Returns the current state of Celo mainnet: chain ID, latest block number, and current gas price. Useful as a health check or to anchor a multi-step agent task to a known block.",
    "returns": "{ chainId, latestBlock, gasPrice }",
    "examples": [
      "What's the latest block on Celo right now?"
    ]
  },
  "get_block": {
    "summary": "Fetch a block by number, hash, or latest",
    "description": "Fetch a Celo mainnet block by number, by hash, or pass 'latest' to get the head block. Optionally include full transaction objects.",
    "returns": "Block object with hash, parentHash, timestamp, transactions, gas info.",
    "examples": [
      "Show me block 30000000 on Celo."
    ]
  },
  "get_latest_blocks": {
    "summary": "Most recent blocks on Celo mainnet",
    "description": "Fetch the N most recent blocks on Celo mainnet, newest first. Up to 100 per call, with optional offset for pagination.",
    "returns": "Array of block objects, newest first.",
    "examples": [
      "Show me the last 10 blocks on Celo."
    ]
  },
  "get_transaction": {
    "summary": "Transaction + receipt by hash",
    "description": "Fetch a single transaction and its receipt by hash. Includes status, gas used, logs, and decoded value.",
    "returns": "{ transaction, receipt } — confirmed or pending.",
    "examples": [
      "Did transaction 0xabc… succeed?"
    ]
  },
  "get_wallet_address": {
    "summary": "Signer address from CELO_PRIVATE_KEY",
    "description": "Returns the wallet address derived from CELO_PRIVATE_KEY in the server env. Use when you need the signer explicitly; omit address on other tools to default to this wallet when the key is configured. On hosted MCP, returns an error without a configured key.",
    "returns": "{ wallet_address, has_wallet, source }",
    "examples": [
      "What is my wallet address?"
    ]
  },
  "get_account": {
    "summary": "Native CELO balance, nonce, contract flag",
    "description": "Returns the native CELO balance, current nonce, and whether the address is a contract on Celo mainnet. Omit address on local stdio when CELO_PRIVATE_KEY is set to use the configured signer.",
    "returns": "{ balance (wei + formatted), nonce, isContract }",
    "examples": [
      "How much CELO does 0x… hold?",
      "What is my CELO balance?"
    ]
  },
  "resolve_ens": {
    "summary": "Resolve an ENS name to a Celo or Ethereum address",
    "description": "Resolves an ENS name to an on-chain address using CCIP-Read. Defaults to Celo (coinType derived from chain ID 42220) and falls back to the Ethereum mainnet record (coinType 60) when no Celo record exists. Also accepts a raw 0x… address and returns it unchanged.",
    "returns": "{ address, ens?: { name, normalizedName, resolvedVia? } }",
    "examples": [
      "Resolve celina.eth on Celo."
    ]
  },
  "get_celo_balances": {
    "summary": "Named registry token balances (default: CELO + USDm)",
    "description": "Named registry token balances (default: CELO + USDm).",
    "returns": "Array of { symbol, address, balance, decimals, formatted }.",
    "examples": [
      "What does 0x… hold in CELO and USDm?",
      "What are my CELO and USDm balances?"
    ]
  },
  "get_stablecoin_balances": {
    "summary": "Scan fiat-pegged registry stablecoins; omits zero balances by default",
    "description": "Scan fiat-pegged registry stablecoins (Mento *m, USDT, USDC, etc.) in one call. Omits zero balances by default. Excludes GoodDollar (G$) and WETH — use get_token_balance or GoodDollar tools for those.",
    "returns": "Array of stablecoin balance entries.",
    "examples": [
      "Which stablecoins does 0x… hold?"
    ]
  },
  "get_token_info": {
    "summary": "Registry token metadata (no balance read)",
    "description": "Registry token metadata (no balance read).",
    "returns": "{ symbol, name, decimals, address }",
    "examples": [
      "What's the contract address of USDm?"
    ]
  },
  "estimate_send": {
    "summary": "Gas estimate for a CELO/ERC-20 send",
    "description": "Estimates gas for sending CELO or an ERC-20 token on mainnet without broadcasting. Requires CELO_PRIVATE_KEY — fails on hosted MCP without a local signer.",
    "returns": "{ gas, maxFeePerGas, maxPriorityFeePerGas, estimatedCostWei }",
    "examples": [
      "Estimate the gas to send 1 USDm to 0x…"
    ]
  },
  "send_token": {
    "summary": "Broadcast a CELO or ERC-20 transfer",
    "description": "Send CELO or an ERC-20 token on Celo mainnet. Requires CELO_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber }",
    "examples": [
      "Send 0.5 USDm to 0x…"
    ]
  },
  "get_gooddollar_whitelisting_info": {
    "summary": "IdentityV4 whitelist status for a wallet",
    "description": "Returns GoodDollar IdentityV4 whitelisting status for a wallet. Connected wallets resolve to their verified root — returns isWhitelisted, whitelistedRoot, checkedAddress, reverification timeline, and whitelist dates.",
    "returns": "{ isWhitelisted, whitelistedRoot, isConnectedWallet, checkedAddress, reverification, … }",
    "examples": [
      "Is 0x… GoodDollar whitelisted?"
    ]
  },
  "get_gooddollar_identity_link": {
    "summary": "How a wallet links to GoodDollar identity",
    "description": "Inspect how a wallet connects to GoodDollar IdentityV4: resolved whitelisted root, connected-to root (from connectedAccounts), whether the address is itself the root, and live isWhitelisted on the checked identity.",
    "returns": "{ whitelistedRoot, isConnectedWallet, isWhitelistedRoot, connectedTo, checkedAddress, isWhitelisted }",
    "examples": [
      "Which GoodDollar identity root is 0x… linked to?"
    ]
  },
  "get_gooddollar_ubi_entitlement": {
    "summary": "Daily UBI claim eligibility (amount, root, reasons)",
    "description": "Check whether an address can claim today's GoodDollar UBI on Celo mainnet — returns the claimable G$ amount, the resolved whitelist root, and any reasons the claim is blocked.",
    "returns": "{ isEligibleToClaim, claimableAmount, whitelistedRoot, isConnectedWallet, identity.isWhitelisted, reasons }",
    "examples": [
      "Can 0x… claim GoodDollar UBI today?"
    ]
  },
  "get_gooddollar_reserve_quote": {
    "summary": "G$ ↔ USDm quote via GoodDollar MentoBroker reserve",
    "description": "GoodDollar reserve quote for G$ ↔ USDm on Celo mainnet via the on-chain MentoBroker bonding curve — not Uniswap. Pair-limited to GoodDollar/G$ ↔ USDm/cUSD. Read-only and wallet-free.",
    "examples": [
      "Quote 1000 G$ to USDm via GoodDollar reserve.",
      "Quote 10 USDm to G$."
    ]
  },
  "estimate_gooddollar_reserve_swap": {
    "summary": "Gas estimate for a G$ ↔ USDm reserve swap",
    "description": "Estimate gas for a GoodDollar reserve swap on Celo mainnet (G$ ↔ USDm via MentoBroker), including ERC-20 approval when needed. Requires CELO_PRIVATE_KEY — fails on hosted MCP without a local signer.",
    "returns": "{ approvalNeeded, approvalGas?, swapGas, totalGas, expectedOut, amountOutMin, … }",
    "examples": [
      "Estimate gas to swap 1000 G$ to USDm via GoodDollar reserve."
    ]
  },
  "execute_gooddollar_reserve_swap": {
    "summary": "Send approval + MentoBroker reserve swap on mainnet",
    "description": "Execute a GoodDollar reserve swap for G$ ↔ USDm on Celo mainnet via MentoBroker. Sends ERC-20 approval first if needed, then broker swapIn. Requires CELO_PRIVATE_KEY in your MCP client env (stdio only).",
    "returns": "{ approvalHash?, hash, status, expectedOut, … }",
    "examples": [
      "Swap 1 G$ to USDm via GoodDollar reserve."
    ]
  },
  "claim_daily_gooddollar_ubi": {
    "summary": "Claim today's GoodDollar UBI (G$)",
    "description": "Claim today's GoodDollar UBI for the MCP server wallet on Celo mainnet. G$ is sent to the signer; gas is paid in CELO. One claim per verified identity per day. Requires CELO_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, amountClaimed, blockNumber }",
    "examples": [
      "Claim today's GoodDollar UBI."
    ]
  },
  "get_mento_fx_quote": {
    "summary": "Oracle-priced FX quote between Mento stables",
    "description": "Get an expected Mento FX conversion output for a token pair on mainnet (e.g. USDm → EURm), priced via the Mento oracle. Read-only and wallet-free. G$ ↔ USDm is not Mento FX — use get_gooddollar_reserve_quote for that pair.",
    "returns": "{ amountIn, amountOut, rate, route }",
    "examples": [
      "Quote 100 USDm to EURm via Mento."
    ]
  },
  "estimate_mento_fx": {
    "summary": "Gas estimate for a Mento FX swap",
    "description": "Estimate gas for a Mento FX conversion on mainnet, including the ERC-20 approval step if one is required. Requires CELO_PRIVATE_KEY — fails on hosted MCP without a local signer.",
    "returns": "{ approvalGas?, swapGas, totalGas, estimatedCostWei }",
    "examples": [
      "Estimate gas to convert 100 USDm to EURm via Mento."
    ]
  },
  "execute_mento_fx": {
    "summary": "Send approval + Mento FX swap on mainnet",
    "description": "Execute a Mento FX conversion on mainnet (e.g. USDm → EURm via Mento oracle pools). Sends the ERC-20 approval first if needed, then the FX trade. Requires CELO_PRIVATE_KEY in your MCP client env.",
    "returns": "{ approvalHash?, swapHash, status, blockNumber }",
    "examples": [
      "Convert 100 USDm to EURm."
    ]
  },
  "get_uniswap_quote": {
    "summary": "Uniswap v4 expected output for a token pair",
    "description": "Get an expected Uniswap v4 swap output on Celo mainnet for a token pair (e.g. G$ → USDT, USDC → USDT). Read-only and wallet-free. CELO swaps route through WCELO pools. For G$ ↔ USDm, use get_gooddollar_reserve_quote — Uniswap pools for that pair are typically illiquid.",
    "returns": "{ amountIn, expectedOut, route, pool }",
    "examples": [
      "Quote 1000 G$ to USDT on Uniswap.",
      "Quote 50 USDC to USDT on Uniswap v4."
    ]
  },
  "estimate_uniswap_swap": {
    "summary": "Gas estimate for a Uniswap v4 swap",
    "description": "Estimate gas for a Uniswap v4 swap on Celo mainnet, including any required ERC-20 approve and Permit2 approve steps. Requires CELO_PRIVATE_KEY — fails on hosted MCP without a local signer.",
    "returns": "{ approvalGas?, permit2Gas?, swapGas, totalGas, estimatedCostWei }",
    "examples": [
      "Estimate gas to swap 1000 G$ to USDT on Uniswap v4."
    ]
  },
  "execute_uniswap_swap": {
    "summary": "Swap via Uniswap v4 Universal Router + Permit2",
    "description": "Execute a Uniswap v4 swap on Celo mainnet via the Universal Router with Permit2. Sends any required ERC-20 approve and Permit2 approve steps first, then the swap. CELO swaps require WCELO balance on the signer. Requires CELO_PRIVATE_KEY in your MCP client env. All on-chain steps include the CELINA attribution tag.",
    "returns": "{ approvalHash?, permit2Hash?, swapHash, status, blockNumber }",
    "examples": [
      "Swap 1000 G$ to USDT on Uniswap.",
      "Swap 25 USDC to USDT via Uniswap v4."
    ]
  },
  "get_aave_balances": {
    "summary": "Supplied aToken positions on Aave V3",
    "description": "Return an address's supplied Aave V3 positions on Celo mainnet by reading aToken balances (e.g. aCelUSDT). Amounts are in underlying token units including accrued interest. Supports USDT, WETH, USDm, USDC, CELO, and EURm. Omits zero balances by default.",
    "returns": "{ address, market, balances: [{ symbol, underlying, aToken, raw, formatted }] }",
    "examples": [
      "What do I have supplied on Aave?",
      "Check my Aave USDT supply balance on Celo."
    ]
  },
  "supply_aave": {
    "summary": "Lend tokens to Aave V3 on Celo",
    "description": "Supply (lend) supported tokens to Aave V3 on Celo mainnet and receive aTokens. Supports USDT, WETH, USDm, USDC, CELO, and EURm. Sends an ERC-20 approval first if needed. Requires CELO_PRIVATE_KEY in your MCP client env.",
    "returns": "{ approvalHash?, supplyHash, status, blockNumber }",
    "examples": [
      "Lend 100 USDC to Aave on Celo.",
      "Supply 1 CELO to Aave."
    ]
  },
  "withdraw_aave": {
    "summary": "Redeem aTokens back to underlying",
    "description": "Withdraw supported tokens from Aave V3 on Celo mainnet by redeeming aTokens. Supports USDT, WETH, USDm, USDC, CELO, and EURm. Use get_aave_balances first to confirm supplied amount; pass an explicit amount or set withdrawMax to pull the full supplied balance. Requires CELO_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber, amountWithdrawn }",
    "examples": [
      "Withdraw all my USDC from Aave.",
      "Withdraw 0.5 CELO from Aave."
    ]
  },
  "verify_self_agent": {
    "summary": "Check if an agent is a verified human",
    "description": "Verify whether an agent address is backed by a real human on Self Agent ID (Celo mainnet). Checks on-chain registration, proof provider, credentials, and proof expiry.",
    "returns": "{ isVerified, registration, credentials, proofExpiry, … }",
    "examples": [
      "Is 0x… a verified human on Self?"
    ]
  },
  "lookup_self_agent": {
    "summary": "Resolve a Self Agent ID by numeric ID",
    "description": "Look up a Self Agent ID by numeric on-chain ID via ai.self.xyz, enriched with on-chain proof expiry from the registry.",
    "returns": "{ agentId, address, metadata, proofExpiry, … }",
    "examples": [
      "Look up Self agent 42."
    ]
  },
  "verify_self_request": {
    "summary": "Validate signed Self agent HTTP headers",
    "description": "Verify incoming HTTP request headers signed by a Self Agent (x-self-agent-signature, x-self-agent-timestamp). Recovers signer from signature and checks on-chain registration.",
    "returns": "{ valid, signer, registration }",
    "examples": [
      "Verify this signed Self agent request from these headers."
    ]
  },
  "register_self_agent": {
    "summary": "Start Self Agent ID registration (QR flow)",
    "description": "Start Self Agent ID registration. Returns a QR/deep link for the human to scan with the Self app. Poll with check_self_registration. Prefer local stdio — session state is unreliable on hosted serverless.",
    "returns": "{ sessionId, qrUrl, deepLink, … }",
    "examples": [
      "Register me as a Self agent."
    ]
  },
  "check_self_registration": {
    "summary": "Poll a Self registration / refresh session",
    "description": "Poll a pending Self registration, proof refresh, or deregistration session. Returns private_key_hex when registration completes. Prefer local stdio — session state is unreliable on hosted serverless.",
    "returns": "{ status, agentId?, private_key_hex?, … }",
    "examples": [
      "Check the status of my Self registration session."
    ]
  },
  "get_self_identity": {
    "summary": "On-chain identity for configured Self agent",
    "description": "Return the configured Self agent's on-chain identity, credentials summary, and proof expiry. Requires SELF_AGENT_PRIVATE_KEY — fails on hosted MCP without a configured agent key.",
    "returns": "{ agentId, address, credentials, proofExpiry, … }",
    "examples": [
      "What's my Self agent identity and proof status?"
    ]
  },
  "refresh_self_proof": {
    "summary": "Re-run human proof after expiry",
    "description": "Start a human proof refresh after on-chain proof expiry (isProofFresh is false). Returns an error while the proof is still fresh. Poll completion with check_self_registration. Prefer local stdio — session state is unreliable on hosted serverless.",
    "returns": "{ sessionId, qrUrl, … }",
    "examples": [
      "Refresh my Self human proof."
    ]
  },
  "deregister_self_agent": {
    "summary": "Irreversibly deregister a Self agent",
    "description": "Start irreversible Self agent deregistration. Human must confirm via Self app QR. Poll with check_self_registration. Prefer local stdio — session state is unreliable on hosted serverless.",
    "returns": "{ sessionId, qrUrl, … }",
    "examples": [
      "Deregister my Self agent."
    ]
  },
  "sign_self_request": {
    "summary": "Produce x-self-agent-* headers for an HTTP call",
    "description": "Sign an HTTP request with the configured Self agent identity. Returns x-self-agent-* headers for gated APIs. Requires SELF_AGENT_PRIVATE_KEY — fails on hosted MCP without a configured agent key. For Self demo endpoints on Celo mainnet, use ?network=celo-mainnet.",
    "returns": "{ headers: { 'x-self-agent-signature', 'x-self-agent-timestamp', … } }",
    "examples": [
      "Sign a GET request to https://api.self.xyz/me as my Self agent."
    ]
  },
  "authenticated_self_fetch": {
    "summary": "HTTP fetch with Self agent auth applied",
    "description": "Make an HTTP request with Self Agent ID authentication headers applied automatically. Requires SELF_AGENT_PRIVATE_KEY — fails on hosted MCP without a configured agent key. For Self demo endpoints on Celo mainnet, use ?network=celo-mainnet.",
    "returns": "{ status, headers, body }",
    "examples": [
      "Fetch https://api.self.xyz/me with my Self agent credentials."
    ]
  },
  "get_token_balance": {
    "summary": "Single registry token balance (symbol or known registry address)",
    "description": "Single registry token balance (symbol or known registry address).",
    "returns": "{ balance, formatted, decimals, symbol }",
    "examples": [
      "What's 0x…'s balance of token 0x…?",
      "What's my USDT balance?"
    ]
  },
  "get_gas_fee_data": {
    "summary": "Current EIP-1559 gas fees on Celo",
    "description": "Return current gas fees on Celo mainnet, including EIP-1559 maxFeePerGas and maxPriorityFeePerGas when supported, alongside the legacy gasPrice.",
    "returns": "{ gasPrice, maxFeePerGas?, maxPriorityFeePerGas? }",
    "examples": [
      "What are current gas fees on Celo?"
    ]
  },
  "estimate_transaction": {
    "summary": "Generic gas estimate for any tx",
    "description": "Estimate gas for an arbitrary transaction on Celo mainnet from from/to/value/data fields. Useful for raw contract calls before sending.",
    "returns": "{ gasLimit, gasPrice, estimatedFee }",
    "examples": [
      "Estimate gas to call this contract from 0x…"
    ]
  },
  "get_governance_proposals": {
    "summary": "Paginated Celo governance proposals",
    "description": "List Celo governance proposals (queued, approved, referendum, execution, expiration) with pagination. Includes proposer, stage, and vote totals.",
    "returns": "Array of proposal summaries with stage, deposit, and vote totals.",
    "examples": [
      "List the latest Celo governance proposals."
    ]
  },
  "get_proposal_details": {
    "summary": "Single proposal + CGP content",
    "description": "Fetch full details for a Celo governance proposal by ID, including on-chain stage, vote tallies, and the linked Celo Governance Proposal (CGP) markdown content when available.",
    "returns": "{ id, stage, proposer, votes, transactions, cgp? }",
    "examples": [
      "Show me details of Celo proposal 245."
    ]
  },
  "get_staking_balances": {
    "summary": "Staking votes by validator group",
    "description": "Return an address's staking votes on Celo mainnet, broken down by validator group, including active and pending amounts.",
    "returns": "{ groups: [{ group, active, pending }], totals }",
    "examples": [
      "What does 0x… have staked on Celo?"
    ]
  },
  "get_activatable_stakes": {
    "summary": "Pending stakes ready to activate",
    "description": "Return any pending staking votes for an address that are now eligible to be activated on Celo mainnet.",
    "returns": "Array of { group, pendingAmount, activatableSince }.",
    "examples": [
      "Do I have any Celo stakes ready to activate?"
    ]
  },
  "get_validator_groups": {
    "summary": "Paginated validator groups",
    "description": "List Celo validator groups with pagination — name, address, members, and total votes.",
    "returns": "Array of validator group summaries.",
    "examples": [
      "List the top Celo validator groups."
    ]
  },
  "get_validator_group_details": {
    "summary": "Single validator group details",
    "description": "Fetch full details for a single Celo validator group by address — members, votes, commission, and slashing history.",
    "returns": "{ name, address, members, votes, commission, … }",
    "examples": [
      "Show me details for validator group 0x…"
    ]
  },
  "get_total_staking_info": {
    "summary": "Network-wide staking totals",
    "description": "Return network-wide staking totals on Celo: total locked, total votes, number of elected validators, and current epoch info.",
    "returns": "{ totalLocked, totalVotes, electedValidators, epoch }",
    "examples": [
      "How much CELO is staked network-wide?"
    ]
  },
  "get_nft_info": {
    "summary": "NFT token info + metadata",
    "description": "Fetch info and metadata for an NFT on Celo — supports ERC-721 and ERC-1155. Resolves tokenURI and parses metadata when available.",
    "returns": "{ contract, tokenId, owner?, tokenURI, metadata }",
    "examples": [
      "Show me NFT #42 from contract 0x…"
    ]
  },
  "get_nft_balance": {
    "summary": "ERC-721 / ERC-1155 balance",
    "description": "Return the NFT balance of a wallet for a given contract — count for ERC-721 or per-token balance for ERC-1155.",
    "returns": "{ balance, standard }",
    "examples": [
      "How many NFTs of contract 0x… does 0x… own?"
    ]
  },
  "call_contract_function": {
    "summary": "Read-only contract call with caller ABI",
    "description": "Make a read-only call to any Celo mainnet contract using a caller-supplied ABI fragment. No wallet required; does not broadcast.",
    "returns": "Decoded function return value(s).",
    "examples": [
      "Call totalSupply() on contract 0x…"
    ]
  },
  "estimate_contract_gas": {
    "summary": "Gas estimate for a contract call",
    "description": "Estimate gas for invoking a contract function on Celo mainnet with a caller-supplied ABI fragment. Does not broadcast.",
    "returns": "{ gasLimit, gasPrice, estimatedFee }",
    "examples": [
      "Estimate gas to mint() on contract 0x… from 0x…"
    ]
  }
};
