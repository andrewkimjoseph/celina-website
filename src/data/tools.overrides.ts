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
  "verify_attribution_tag": {
    "summary": "Decode ERC-8021 (+ historical CELINA) attribution from tx calldata",
    "description": "Fetches a Celo mainnet transaction by hash and inspects its calldata for attribution. New Celina writes use ERC-8021 Schema 0 codes (celina, hackathon codes like celo_862c21dd97a7, app tags). Historical txs may also include legacy UTF-8 CELINA|… — returned in legacyTags when present. Pass an optional tag to check for a specific code on either layer. Prefer check_attribution_tag when you want a unified custom tags list.",
    "inputs": [
      {
        "name": "hash",
        "type": "string",
        "required": true,
        "description": "Transaction hash (0x + 64 hex characters)."
      },
      {
        "name": "tag",
        "type": "string",
        "required": false,
        "description": "Optional attribution code to match (e.g. celo_862c21dd97a7, MY_APP). When omitted, matched is true if any tag is present."
      }
    ],
    "returns": "{ hash, input, legacyTags, erc8021: { codes, schemaId } | null, matched }",
    "examples": [
      "Does transaction 0xabc… include celo_862c21dd97a7?",
      "What attribution tags are on this tx?"
    ]
  },
  "check_attribution_tag": {
    "summary": "List or check custom attribution tags on a tx",
    "description": "Fetches a Celo mainnet transaction by hash and returns a unified tags array of custom/app attribution codes (excludes platform CELINA/celina), plus raw erc8021 and optional historical legacyTags. Omit tag to list all custom codes; pass tag to check whether that code is present on either layer. Prefer this for “what tags are on this tx?”.",
    "inputs": [
      {
        "name": "hash",
        "type": "string",
        "required": true,
        "description": "Transaction hash (0x + 64 hex characters)."
      },
      {
        "name": "tag",
        "type": "string",
        "required": false,
        "description": "Optional attribution code to match (e.g. celo_862c21dd97a7, MY_APP). Omit to list all custom tags."
      }
    ],
    "returns": "{ hash, input, tags, legacyTags, erc8021: { codes, schemaId } | null, matched }",
    "examples": [
      "What attribution tags are on this tx?",
      "Does transaction 0xabc… include celo_862c21dd97a7?"
    ]
  },
  "get_wallet_address": {
    "summary": "Signer address(es) from CELO_PRIVATE_KEY / SELF_AGENT_PRIVATE_KEY",
    "description": "Returns the MCP server wallet address(es). Omit signer to get the default signer's address plus every configured wallet (celo, self_agent) in one call — use it to find the Self agent's address before funding it. Pass signer to look up one wallet explicitly. On hosted MCP, returns an error without a configured key.",
    "returns": "{ wallet_address, has_wallet, source, wallets? }",
    "examples": [
      "What is my wallet address?",
      "What is my Self agent's wallet address?"
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
    "description": "Estimates gas for sending CELO or an ERC-20 token on mainnet without broadcasting. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY — fails on hosted MCP without a local signer. Pass signer to estimate from a specific configured wallet.",
    "returns": "{ gas, maxFeePerGas, maxPriorityFeePerGas, estimatedCostWei }",
    "examples": [
      "Estimate the gas to send 1 USDm to 0x…"
    ]
  },
  "send_token": {
    "summary": "Broadcast a CELO or ERC-20 transfer",
    "description": "Send CELO or an ERC-20 token on Celo mainnet. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env. Pass signer to choose which wallet sends — e.g. signer: \"celo\" to fund a freshly registered Self agent before any Self-signed write.",
    "returns": "{ hash, status, blockNumber }",
    "examples": [
      "Send 0.5 USDm to 0x…",
      "Fund my Self agent with 5.2 CELO from my main wallet"
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
    "description": "Inspect how a wallet connects to GoodDollar IdentityV4: resolved whitelisted root, connected-to root (from connectedAccounts), whether the address is itself the root, and live isWhitelisted on the checked identity. Use before choosing face verification (new root) vs execute_connect_gooddollar_identity (link secondary wallet to existing verified root).",
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
    "description": "Verify whether an agent address is backed by a real human on Self Agent ID (Celo mainnet). Defaults to requiring age 18+ and OFAC-clear credentials; pass require_age: 0 or require_ofac: false to relax. Returns credentials including nationality (ISO code) when disclosed at registration.",
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
    "description": "Start Self Agent ID registration. Returns a QR/deep link for the human to scan with the Self app. Defaults to minimum_age 18, nationality disclosure, and OFAC screening. Poll with check_self_registration. Prefer local stdio — session state is unreliable on hosted serverless.",
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
    "description": "Fetch full details for a Celo governance proposal by ID, including on-chain stage, vote tallies, and the linked Celo Governance Proposal (CGP) markdown content when available. Call after get_queued_proposals or get_votable_proposals when you need the title and body before governing.",
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
    "description": "Fetch full details for a single Celo validator group by address — members, votes, on-chain canReceiveVotes headroom (0 means at capacity), eligibility, and slashing history.",
    "returns": "{ name, address, members, votes, canReceiveVotes, eligible, capacity, … }",
    "examples": [
      "Show me details for validator group 0x…",
      "Can cLabs still receive staking votes?"
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
    "description": "Estimate gas for invoking a contract function on Celo mainnet with a caller-supplied ABI fragment. Prefer this before execute_contract_function. Does not broadcast.",
    "returns": "{ gasLimit, gasPrice, estimatedFee }",
    "examples": [
      "Estimate gas to mint() on contract 0x… from 0x…"
    ]
  },
  "execute_contract_function": {
    "summary": "Broadcast a contract write with caller ABI",
    "description": "Call a state-changing function on any Celo mainnet contract using a caller-supplied ABI fragment and positional args (like viem). Optional value is wei as a decimal string. Prefer estimate_contract_gas first. Requires CELO_PRIVATE_KEY in your MCP client env (stdio only).",
    "returns": "{ network, hash, status, from, contractAddress, functionName }",
    "examples": [
      "Call approve(spender, 0) on USDm with the ERC-20 ABI.",
      "Execute mint() on contract 0x… with ABI JSON and args."
    ]
  },
  "prepare_contract_function": {
    "summary": "Prepare an unsigned contract write",
    "description": "Build an unsigned single-step flow for a state-changing contract call using a caller-supplied ABI fragment. User signs in wallet. Prefer estimate_contract_gas first. Optional value is wei as a decimal string.",
    "returns": "SerializedPreparedFlow with one contract step",
    "examples": [
      "Prepare approve(spender, amount) on USDm for the connected wallet."
    ]
  },
  "get_agentkarma_reputation": {
    "summary": "AgentKarma Provider + Consumer reputation for a Celo wallet",
    "description": "Read AgentKarma reputation for a Celo agent wallet via agentkarma.io. Returns Provider/Consumer karma scores, trust tiers, and confidence badges. Read-only trust context — never routes, signs, or holds custody. The subject address is required (no signer fallback).",
    "returns": "{ address, face, provider?, consumer?, autonomy? }",
    "availability": "hosted",
    "examples": [
      "What is the AgentKarma reputation for 0x… on Celo?"
    ]
  },
  "get_agentkarma_celo_agent": {
    "summary": "ERC-8004 Celo agent identity + reputation by ID",
    "description": "Resolve a Celo ERC-8004 agent (identity + reputation) by numeric agent ID through AgentKarma. Read-only external lookup on agentkarma.io.",
    "returns": "{ chain, agentId, owner, agentWallet?, tokenURI?, registration?, reputation?, explorer? }",
    "availability": "hosted",
    "examples": [
      "Look up ERC-8004 agent 9058 on Celo via AgentKarma."
    ]
  },
  "check_agentkarma_counterparty": {
    "summary": "Local trust-policy check against AgentKarma karma",
    "description": "Evaluate a Celo counterparty wallet against a local AgentKarma trust policy (min score, receipt-backed requirements). Returns an explainable allow/deny decision plus the karma snapshot that informed it. Read-only — never routes, signs, or holds custody.",
    "returns": "{ chain, wallet, decision: { allowed, reasons, observed }, snapshot }",
    "availability": "hosted",
    "examples": [
      "Should I trust counterparty 0x… with min score 50 and receipt-backed karma?"
    ]
  },
  "check_humanness": {
    "summary": "Dual-rail humanness check (Self Agent ID or GoodDollar IdentityV4)",
    "description": "Check whether an address passes humanness verification on Celo mainnet. Uses a dual-rail gate: Self Agent ID (verified human-backed agent) OR GoodDollar IdentityV4 (whitelisted face-verified identity). Passes if either rail succeeds. Required before governance and staking execute tools (lock, vote, stake, delegate). Call this first when an agent needs to perform humanness-gated actions.",
    "returns": "{ address, passed, self?: { isVerified, … }, gooddollar?: { isWhitelisted, whitelistedRoot, … } }",
    "examples": [
      "Does 0x… pass humanness verification?",
      "Check humanness for my MCP server wallet before locking CELO."
    ]
  },
  "get_celo_account_registration": {
    "summary": "Whether an address is registered in Celo Accounts",
    "description": "Returns whether an address is registered in the Celo Accounts contract — a prerequisite before locking CELO for governance or staking. Omit address on local stdio when CELO_PRIVATE_KEY is set to check the configured signer.",
    "returns": "{ address, isRegistered }",
    "examples": [
      "Is 0x… registered as a Celo account?",
      "Do I need to register my wallet before locking CELO?"
    ]
  },
  "execute_register_celo_account": {
    "summary": "Register a configured MCP wallet in Celo Accounts",
    "description": "Register a configured MCP server wallet as a Celo account via Accounts.createAccount. Required once before that same wallet can lock CELO for governance or staking. Pass signer to choose which wallet (celo = main, self_agent = Self identity) gets registered. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber }",
    "examples": [
      "Register my wallet as a Celo account."
    ]
  },
  "prepare_register_celo_account": {
    "summary": "Prepare unsigned Celo account registration",
    "description": "Build an unsigned Celo Accounts.createAccount flow for wallet signing. Required once before locking CELO in browser apps.",
    "returns": "SerializedPreparedFlow with one account-registration step",
    "examples": [
      "Prepare account registration for the connected wallet."
    ]
  },
  "get_locked_celo_balance": {
    "summary": "Locked CELO balance and governance voting power",
    "description": "Return locked CELO balances and governance voting power for an address on Celo mainnet via the LockedGold contract. Includes non-voting, voting, and total locked amounts.",
    "returns": "{ address, nonvoting, voting, total, … }",
    "examples": [
      "How much CELO does 0x… have locked?",
      "What is my governance voting power?"
    ]
  },
  "get_pending_withdrawals": {
    "summary": "Pending LockedGold unlocks with maturity timestamps",
    "description": "List pending CELO unlock requests for an address from LockedGold, including amount and timeUntilLesser/Greater maturity timestamps. Use before execute_withdraw_celo or prepare_withdraw_celo.",
    "returns": "Array of { index, value, timeUntilLesser, timeUntilGreater, … }",
    "examples": [
      "Do I have any pending CELO unlocks?",
      "When can I withdraw my unlocked CELO?"
    ]
  },
  "get_votable_proposals": {
    "summary": "Governance proposals currently in Referendum",
    "description": "Return Celo governance proposals currently in the Referendum stage with dequeue index for voting. Use before execute_vote or prepare_vote. For CGP title and markdown, call get_proposal_details on a proposal_id.",
    "returns": "Array of { id, stage, dequeueIndex, … }",
    "examples": [
      "Which governance proposals can I vote on right now?"
    ]
  },
  "get_queued_proposals": {
    "summary": "Governance proposals currently in Queue",
    "description": "Return Celo governance proposals in the Queue stage with upvote weight, dequeueReady, and per-proposal upvoteable flags. When dequeue is overdue, top concurrent proposals are not upvoteable until execute_dequeue_proposals_if_ready. Use get_proposal_details(proposal_id) for CGP title and markdown before upvoting.",
    "returns": "Array of { proposalId, upvotes, stage, url, upvoteable } plus dequeueReady, nextDequeueProposalIds",
    "examples": [
      "Which governance proposals can I upvote right now?",
      "Show queued Celo governance proposals."
    ]
  },
  "get_actionable_governance_proposals": {
    "summary": "Queued and Referendum proposals you can act on",
    "description": "Return Queue and Referendum proposals (hasAny, hasQueued, hasUpvoteableQueued, hasReferendum, queued, referendum) plus dequeueReady and nextDequeueProposalIds. When dequeue is overdue, queued items may have upvoteable=false — call execute_dequeue_proposals_if_ready first. Use get_proposal_details on a proposal_id before governing.",
    "returns": "{ hasAny, hasQueued, hasUpvoteableQueued, hasReferendum, queued, referendum, dequeueReady, nextDequeueProposalIds, message }",
    "examples": [
      "What governance proposals can I act on right now?",
      "Show queued and referendum proposals I can upvote or vote on."
    ]
  },
  "execute_dequeue_proposals_if_ready": {
    "summary": "Dequeue overdue governance proposals",
    "description": "Call Governance.dequeueProposalsIfReady on Celo mainnet. When dequeue is overdue, moves up to concurrentProposals from the Queue into Approval. Requires humanness verification (Self Agent ID or GoodDollar IdentityV4). Use when get_queued_proposals reports dequeueReady. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env (stdio only).",
    "returns": "{ hash, status, from }",
    "examples": [
      "Dequeue the overdue governance proposals.",
      "Call dequeueProposalsIfReady so I can vote after Approval."
    ]
  },
  "execute_lock_celo": {
    "summary": "Lock CELO for governance and staking",
    "description": "Lock CELO into LockedGold for governance voting power and validator staking on Celo mainnet. Requires humanness verification (Self Agent ID or GoodDollar IdentityV4) and a registered Celo account. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber, amountLocked }",
    "examples": [
      "Lock 100 CELO for governance.",
      "Lock CELO so I can stake with a validator group."
    ]
  },
  "execute_unlock_celo": {
    "summary": "Start unlocking locked CELO (3-day timelock)",
    "description": "Begin unlocking locked CELO from LockedGold. Starts a 3-day timelock before funds can be withdrawn. Requires humanness verification. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber }",
    "examples": [
      "Unlock 50 CELO from LockedGold."
    ]
  },
  "execute_relock_celo": {
    "summary": "Relock CELO from a pending withdrawal",
    "description": "Cancel a pending unlock and relock CELO from a pending withdrawal index back into LockedGold. Requires humanness verification. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber }",
    "examples": [
      "Relock CELO from pending withdrawal index 0."
    ]
  },
  "execute_withdraw_celo": {
    "summary": "Withdraw all matured pending CELO unlocks",
    "description": "Withdraw all matured pending CELO unlocks from LockedGold to the signer wallet. Requires humanness verification. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber, amountWithdrawn }",
    "examples": [
      "Withdraw my matured unlocked CELO."
    ]
  },
  "execute_vote": {
    "summary": "Vote on a governance proposal in Referendum",
    "description": "Cast a governance vote (Yes, No, or Abstain) on a Celo proposal in Referendum stage using locked CELO voting power. Requires humanness verification. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber, proposalId, vote }",
    "examples": [
      "Vote Yes on Celo governance proposal 245.",
      "Abstain on the current referendum proposal."
    ]
  },
  "prepare_lock_celo": {
    "summary": "Prepare unsigned lock CELO flow",
    "description": "Build an unsigned LockedGold lock flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one lock step",
    "examples": [
      "Prepare locking 100 CELO for the connected wallet."
    ]
  },
  "prepare_unlock_celo": {
    "summary": "Prepare unsigned unlock CELO flow",
    "description": "Build an unsigned LockedGold unlock flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one unlock step",
    "examples": [
      "Prepare unlocking 50 CELO for the connected wallet."
    ]
  },
  "prepare_relock_celo": {
    "summary": "Prepare unsigned relock CELO flow",
    "description": "Build an unsigned LockedGold relock flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one relock step",
    "examples": [
      "Prepare relocking CELO from pending withdrawal index 0."
    ]
  },
  "prepare_withdraw_celo": {
    "summary": "Prepare unsigned withdraw matured CELO flow",
    "description": "Build an unsigned LockedGold withdraw flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one withdraw step",
    "examples": [
      "Prepare withdrawing matured unlocked CELO."
    ]
  },
  "prepare_vote": {
    "summary": "Prepare unsigned governance vote",
    "description": "Build an unsigned governance vote flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one vote step",
    "examples": [
      "Prepare a Yes vote on proposal 245 for the connected wallet."
    ]
  },
  "get_delegation_info": {
    "summary": "Governance vote delegation from LockedGold",
    "description": "Return governance voting power delegation info for an address from LockedGold — who they delegate to and how much voting power is delegated.",
    "returns": "{ address, delegations: [{ delegatee, percent, … }] }",
    "examples": [
      "Who does 0x… delegate governance power to?",
      "Show my governance delegation settings."
    ]
  },
  "get_governance_delegates": {
    "summary": "Browse Celo Mondo governance delegates",
    "description": "Curated Celo Mondo delegate directory (off-chain, not an on-chain registry). Use when the user asks who to delegate to. Returns name, address, interests, description; optionally LockedGold stats (voting power, total delegated to them). Then pick a delegatee and call execute_delegate_power.",
    "returns": "{ source, delegates: [{ name, address, interests, … }], pagination }",
    "examples": [
      "Who can I delegate my governance voting power to?",
      "List governance delegates focused on DeFi.",
      "Show me the top delegates on Celo Mondo."
    ]
  },
  "get_stake_eligibility": {
    "summary": "Pre-check stake before execute_stake",
    "description": "Call before execute_stake. Checks Election.canReceiveVotes (group headroom), non-voting locked CELO balance, and Celo account registration. Returns canStake and reasons — when false, do not execute (common: 'Group cannot receive votes' for full groups like cLabs).",
    "returns": "{ canStake, reasons, canReceiveVotes, nonvotingLocked, maxStakeAmount, inEligibleGroups }",
    "examples": [
      "Can I stake 1 CELO with validator group 0xe09632da…?",
      "Check stake eligibility for 100 CELO with group 0x… before executing."
    ]
  },
  "execute_stake": {
    "summary": "Stake locked CELO with a validator group",
    "description": "Stake locked CELO with a Celo validator group via the Election contract. Call get_stake_eligibility first — avoids 'Group cannot receive votes' reverts when a group is at capacity. Requires humanness verification and a registered Celo account. Staked votes become active after the next epoch boundary (use execute_activate_stake). Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber, groupAddress, amount }",
    "examples": [
      "Check stake eligibility for 100 CELO with validator group 0x…, then stake if canStake is true."
    ]
  },
  "execute_activate_stake": {
    "summary": "Activate pending stake after epoch boundary",
    "description": "Activate pending staking votes for a validator group after the epoch boundary. Requires humanness verification. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber, groupAddress }",
    "examples": [
      "Activate my pending stake with validator group 0x…"
    ]
  },
  "execute_unstake": {
    "summary": "Unstake CELO from a validator group",
    "description": "Remove staking votes from a Celo validator group. Requires humanness verification. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber, groupAddress, amount }",
    "examples": [
      "Unstake 50 CELO from validator group 0x…"
    ]
  },
  "execute_delegate_power": {
    "summary": "Delegate governance voting power to another address",
    "description": "Delegate a percentage of governance voting power from LockedGold to another address. Requires humanness verification. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber, delegatee, percent }",
    "examples": [
      "Delegate 50% of my governance power to 0x…"
    ]
  },
  "execute_undelegate_power": {
    "summary": "Revoke delegated governance voting power",
    "description": "Revoke a percentage of previously delegated governance voting power from a delegatee address. Requires humanness verification. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber, delegatee, percent }",
    "examples": [
      "Undelegate 100% of governance power from 0x…"
    ]
  },
  "prepare_stake": {
    "summary": "Prepare unsigned stake CELO flow",
    "description": "Build an unsigned Election stake flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one stake step",
    "examples": [
      "Prepare staking 100 CELO with validator group 0x…"
    ]
  },
  "prepare_activate_stake": {
    "summary": "Prepare unsigned activate stake flow",
    "description": "Build an unsigned activate-stake flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one activate step",
    "examples": [
      "Prepare activating pending stake with validator group 0x…"
    ]
  },
  "prepare_unstake": {
    "summary": "Prepare unsigned unstake flow",
    "description": "Build an unsigned Election unstake flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one unstake step",
    "examples": [
      "Prepare unstaking 50 CELO from validator group 0x…"
    ]
  },
  "prepare_delegate_power": {
    "summary": "Prepare unsigned delegate governance power flow",
    "description": "Build an unsigned LockedGold delegate flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one delegate step",
    "examples": [
      "Prepare delegating 50% governance power to 0x…"
    ]
  },
  "prepare_undelegate_power": {
    "summary": "Prepare unsigned undelegate governance power flow",
    "description": "Build an unsigned LockedGold undelegate flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one undelegate step",
    "examples": [
      "Prepare revoking delegated governance power from 0x…"
    ]
  },
  "get_gooddollar_face_verification_link": {
    "summary": "GoodDollar face verification link for humanness",
    "description": "Generate a GoodDollar face verification link for the MCP server wallet when this wallet needs first-time verification as an identity root. Omit callback_url to use https://usecelina.xyz/gooddollar/verify/callback (GoodDollar redirects there with base64 verified and chain params). Skipped when the signer is already whitelisted or linked to a verified root. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY.",
    "returns": "{ from, callbackUrl, link?, skipped?, guidance?, network }",
    "examples": [
      "Get a GoodDollar face verification link for humanness."
    ]
  },
  "execute_connect_gooddollar_identity": {
    "summary": "Connect a secondary wallet to GoodDollar identity root",
    "description": "Connect a secondary wallet to the whitelisted GoodDollar IdentityV4 root so it inherits humanness. The MCP signer (CELO_PRIVATE_KEY) must be the verified whitelisted root; pass the wallet to link as connected_account. If already verified on wallet A and MCP signer is wallet B, switch CELO_PRIVATE_KEY to wallet A and connect B.",
    "returns": "{ hash, status, blockNumber, connectedAccount, from }",
    "examples": [
      "Connect wallet 0x… to my GoodDollar identity."
    ]
  },
  "execute_disconnect_gooddollar_identity": {
    "summary": "Disconnect a secondary wallet from GoodDollar identity",
    "description": "Disconnect a secondary wallet from a GoodDollar IdentityV4 root. Requires CELO_PRIVATE_KEY or SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    "returns": "{ hash, status, blockNumber, connectedAccount }",
    "examples": [
      "Disconnect wallet 0x… from GoodDollar identity."
    ]
  },
  "prepare_connect_gooddollar_identity": {
    "summary": "Prepare unsigned GoodDollar identity connect",
    "description": "Build an unsigned GoodDollar IdentityV4 connect flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one connect step",
    "examples": [
      "Prepare connecting a secondary wallet to GoodDollar identity."
    ]
  },
  "prepare_disconnect_gooddollar_identity": {
    "summary": "Prepare unsigned GoodDollar identity disconnect",
    "description": "Build an unsigned GoodDollar IdentityV4 disconnect flow for wallet signing in browser apps.",
    "returns": "SerializedPreparedFlow with one disconnect step",
    "examples": [
      "Prepare disconnecting a wallet from GoodDollar identity."
    ]
  }
};
