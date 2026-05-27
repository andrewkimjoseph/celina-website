export type ToolKind = "read" | "write";

export interface ToolField {
  name: string;
  type: string;
  required?: boolean;
  description: string;
}

export interface ToolDoc {
  /** snake_case tool name as registered on the MCP server */
  name: string;
  /** url slug (kebab-case) */
  slug: string;
  /** human title */
  title: string;
  /** short one-line summary used on cards */
  summary: string;
  /** longer description shown on the tool page */
  description: string;
  kind: ToolKind;
  category: "Blockchain" | "Account" | "Token" | "Transaction" | "Mento FX" | "Wallet" | "GoodDollar" | "Aave" | "Self" | "Governance" | "Staking" | "NFT" | "Contract";
  inputs: ToolField[];
  /** What the LLM should expect back */
  returns: string;
  /** Optional example natural-language prompts */
  examples?: string[];
}

export const TOOLS: ToolDoc[] = [
  {
    name: "get_network_status",
    slug: "get-network-status",
    title: "Get Network Status",
    summary: "Chain ID, latest block, gas price",
    description:
      "Returns the current state of Celo mainnet: chain ID, latest block number, and current gas price. Useful as a health check or to anchor a multi-step agent task to a known block.",
    kind: "read",
    category: "Blockchain",
    inputs: [],
    returns: "{ chainId, latestBlock, gasPrice }",
    examples: ["What's the latest block on Celo right now?"],
  },
  {
    name: "get_block",
    slug: "get-block",
    title: "Get Block",
    summary: "Fetch a block by number, hash, or latest",
    description: "Fetch a Celo mainnet block by number, by hash, or pass 'latest' to get the head block.",
    kind: "read",
    category: "Blockchain",
    inputs: [
      { name: "blockId", type: "number | hex | 'latest'", required: true, description: "Block number, 0x-prefixed hash, or the literal 'latest'." },
    ],
    returns: "Block object with hash, parentHash, timestamp, transactions, gas info.",
    examples: ["Show me block 30000000 on Celo."],
  },
  {
    name: "get_latest_blocks",
    slug: "get-latest-blocks",
    title: "Get Latest Blocks",
    summary: "Most recent blocks on Celo mainnet",
    description: "Fetch the N most recent blocks on Celo mainnet, newest first. Capped at 20 blocks per call.",
    kind: "read",
    category: "Blockchain",
    inputs: [
      { name: "count", type: "integer (1-20)", required: false, description: "How many recent blocks to return. Defaults to 5." },
    ],
    returns: "Array of block objects, newest first.",
    examples: ["Show me the last 10 blocks on Celo."],
  },
  {
    name: "get_transaction",
    slug: "get-transaction",
    title: "Get Transaction",
    summary: "Transaction + receipt by hash",
    description: "Fetch a single transaction and its receipt by hash. Includes status, gas used, logs, and decoded value.",
    kind: "read",
    category: "Blockchain",
    inputs: [
      { name: "hash", type: "0x… (32 bytes)", required: true, description: "Transaction hash to look up." },
    ],
    returns: "{ transaction, receipt } — confirmed or pending.",
    examples: ["Did transaction 0xabc… succeed?"],
  },
  {
    name: "get_account",
    slug: "get-account",
    title: "Get Account",
    summary: "Native CELO balance, nonce, contract flag",
    description: "Returns the native CELO balance, current nonce, and whether the address is a contract on Celo mainnet.",
    kind: "read",
    category: "Account",
    inputs: [
      { name: "address", type: "0x… address", required: true, description: "Celo mainnet account to inspect." },
    ],
    returns: "{ balance (wei + formatted), nonce, isContract }",
    examples: ["How much CELO does 0x… hold?"],
  },
  {
    name: "resolve_ens",
    slug: "resolve-ens",
    title: "Resolve ENS",
    summary: "Resolve an ENS name to a Celo or Ethereum address",
    description:
      "Resolves an ENS name to an on-chain address using CCIP-Read. Defaults to Celo (coinType derived from chain ID 42220) and falls back to the Ethereum mainnet record (coinType 60) when no Celo record exists. Also accepts a raw 0x… address and returns it unchanged.",
    kind: "read",
    category: "Account",
    inputs: [
      { name: "name", type: "string", required: true, description: "ENS name (e.g. 'celina.eth') or a 0x… address to pass through." },
      { name: "chain", type: "'celo' | 'ethereum'", required: false, description: "Which address record to resolve. Defaults to 'celo' with Ethereum fallback." },
    ],
    returns: "{ address, ens?: { name, normalizedName, resolvedVia? } }",
    examples: ["Resolve celina.eth on Celo."],
  },
  {
    name: "get_celo_balances",
    slug: "get-celo-balances",
    title: "Get Celo Balances",
    summary: "Native CELO + ERC-20 balances",
    description:
      "Returns native CELO and ERC-20 balances for an address on mainnet. Defaults to CELO + USDm if no tokens are specified.",
    kind: "read",
    category: "Token",
    inputs: [
      { name: "address", type: "0x… address", required: true, description: "Address to query." },
      { name: "tokens", type: "string[]", required: false, description: "Token symbols or addresses to include (e.g. ['CELO','USDm','cUSD'])." },
    ],
    returns: "Array of { symbol, address, balance, decimals, formatted }.",
    examples: ["What does 0x… hold in CELO and USDm?"],
  },
  {
    name: "get_stablecoin_balances",
    slug: "get-stablecoin-balances",
    title: "Get Stablecoin Balances",
    summary: "Mento, USDC, USDT and other stables",
    description:
      "Returns balances for Celo mainnet local stablecoins (all 15 Mento stables, USDC, USDT, etc.). Checks every supported stablecoin by default and omits zero balances unless you opt in.",
    kind: "read",
    category: "Token",
    inputs: [
      { name: "address", type: "0x… address", required: true, description: "Address to query." },
      { name: "stablecoins", type: "string[]", required: false, description: "Specific stablecoin symbols to check (e.g. ['USDm','EURm'])." },
      { name: "includeZero", type: "boolean", required: false, description: "Include stablecoins with zero balance. Defaults to false." },
    ],
    returns: "Array of stablecoin balance entries.",
    examples: ["Which stablecoins does 0x… hold?"],
  },
  {
    name: "get_token_info",
    slug: "get-token-info",
    title: "Get Token Info",
    summary: "Metadata for any ERC-20 on mainnet",
    description: "Returns metadata for a known or custom ERC-20 token on Celo mainnet — symbol, name, decimals, address.",
    kind: "read",
    category: "Token",
    inputs: [
      { name: "token", type: "symbol or 0x… address", required: true, description: "Known symbol (e.g. USDm) or token contract address." },
    ],
    returns: "{ symbol, name, decimals, address }",
    examples: ["What's the contract address of USDm?"],
  },
  {
    name: "estimate_send",
    slug: "estimate-send",
    title: "Estimate Send",
    summary: "Gas estimate for a CELO/ERC-20 send",
    description:
      "Estimates gas for sending CELO or an ERC-20 token on mainnet without broadcasting. Useful for preview-and-confirm UX before send_token is called.",
    kind: "read",
    category: "Transaction",
    inputs: [
      { name: "to", type: "0x… address", required: true, description: "Recipient." },
      { name: "token", type: "symbol or 0x…", required: false, description: "Token to send. Defaults to CELO." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount, e.g. '1.5'." },
    ],
    returns: "{ gas, maxFeePerGas, maxPriorityFeePerGas, estimatedCostWei }",
    examples: ["Estimate the gas to send 1 USDm to 0x…"],
  },
  {
    name: "send_token",
    slug: "send-token",
    title: "Send Token",
    summary: "Broadcast a CELO or ERC-20 transfer",
    description:
      "Send CELO or an ERC-20 token on Celo mainnet. Requires CELO_PRIVATE_KEY in your MCP client env.",
    kind: "write",
    category: "Transaction",
    inputs: [
      { name: "to", type: "0x… address", required: true, description: "Recipient." },
      { name: "token", type: "symbol or 0x…", required: false, description: "Token to send. Defaults to CELO." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount, e.g. '0.01'." },
    ],
    returns: "{ hash, status, blockNumber }",
    examples: ["Send 0.5 USDm to 0x…"],
  },
  {
    name: "get_gooddollar_whitelisting_info",
    slug: "get-gooddollar-whitelisting-info",
    title: "Get GoodDollar Whitelisting Info",
    summary: "IdentityV4 whitelist status for a wallet",
    description:
      "Returns GoodDollar IdentityV4 whitelisting status for a wallet — whether it's whitelisted, when, last authentication date, and reverification progress.",
    kind: "read",
    category: "GoodDollar",
    inputs: [
      { name: "address", type: "0x… address", required: true, description: "Wallet to check." },
    ],
    returns: "{ isWhitelisted, whitelistedAt, lastAuthenticated, daysUntilReverification, … }",
    examples: ["Is 0x… GoodDollar whitelisted?"],
  },
  {
    name: "get_mento_fx_quote",
    slug: "get-mento-fx-quote",
    title: "Get Mento FX Quote",
    summary: "Oracle-priced FX quote between Mento stables",
    description:
      "Get an expected Mento FX conversion output for a token pair on mainnet (e.g. USDm → EURm), priced via the Mento oracle. Read-only and wallet-free.",
    kind: "read",
    category: "Mento FX",
    inputs: [
      { name: "tokenIn", type: "symbol or 0x…", required: true, description: "Input token." },
      { name: "tokenOut", type: "symbol or 0x…", required: true, description: "Output token." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount of tokenIn, e.g. '100'." },
    ],
    returns: "{ amountIn, amountOut, rate, route }",
    examples: ["Quote 100 USDm to EURm via Mento."],
  },
  {
    name: "estimate_mento_fx",
    slug: "estimate-mento-fx",
    title: "Estimate Mento FX",
    summary: "Gas estimate for a Mento FX swap",
    description:
      "Estimate gas for a Mento FX conversion on mainnet, including the ERC-20 approval step if one is required. Does not broadcast.",
    kind: "read",
    category: "Mento FX",
    inputs: [
      { name: "tokenIn", type: "symbol or 0x…", required: true, description: "Input token." },
      { name: "tokenOut", type: "symbol or 0x…", required: true, description: "Output token." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount of tokenIn." },
      { name: "recipient", type: "0x… address", required: false, description: "Address that receives output tokens. Defaults to the signer." },
      { name: "slippageTolerance", type: "number (0-20)", required: false, description: "Max slippage in percent. Defaults to 0.5." },
      { name: "deadlineMinutes", type: "integer", required: false, description: "Transaction deadline in minutes. Defaults to 5." },
    ],
    returns: "{ approvalGas?, swapGas, totalGas, estimatedCostWei }",
  },
  {
    name: "execute_mento_fx",
    slug: "execute-mento-fx",
    title: "Execute Mento FX",
    summary: "Send approval + Mento FX swap on mainnet",
    description:
      "Execute a Mento FX conversion on mainnet (e.g. USDm → EURm via Mento oracle pools). Sends the ERC-20 approval first if needed, then the FX trade. Requires CELO_PRIVATE_KEY in your MCP client env.",
    kind: "write",
    category: "Mento FX",
    inputs: [
      { name: "tokenIn", type: "symbol or 0x…", required: true, description: "Input token." },
      { name: "tokenOut", type: "symbol or 0x…", required: true, description: "Output token." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount of tokenIn." },
      { name: "recipient", type: "0x… address", required: false, description: "Address that receives output tokens. Defaults to the signer." },
      { name: "slippageTolerance", type: "number (0-20)", required: false, description: "Max slippage in percent. Defaults to 0.5." },
      { name: "deadlineMinutes", type: "integer", required: false, description: "Transaction deadline in minutes. Defaults to 5." },
    ],
    returns: "{ approvalHash?, swapHash, status, blockNumber }",
    examples: ["Convert 100 USDm to EURm."],
  },
  {
    name: "supply_aave",
    slug: "supply-aave",
    title: "Supply Aave",
    summary: "Lend tokens to Aave V3 on Celo",
    description:
      "Supply (lend) supported tokens to Aave V3 on Celo mainnet and receive aTokens. Supports USDT, WETH, USDm, USDC, CELO, and EURm. Sends an ERC-20 approval first if needed. Requires CELO_PRIVATE_KEY in your MCP client env.",
    kind: "write",
    category: "Aave",
    inputs: [
      { name: "token", type: "USDT | WETH | USDm | USDC | CELO | EURm", required: true, description: "Token symbol to supply to Aave." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount, e.g. '100'." },
    ],
    returns: "{ approvalHash?, supplyHash, status, blockNumber }",
    examples: ["Lend 100 USDC to Aave on Celo.", "Supply 1 CELO to Aave."],
  },
  {
    name: "withdraw_aave",
    slug: "withdraw-aave",
    title: "Withdraw Aave",
    summary: "Redeem aTokens back to underlying",
    description:
      "Withdraw supported tokens from Aave V3 on Celo mainnet by redeeming aTokens. Supports USDT, WETH, USDm, USDC, CELO, and EURm. Pass an explicit amount or set withdrawMax to pull the full supplied balance. Requires CELO_PRIVATE_KEY in your MCP client env.",
    kind: "write",
    category: "Aave",
    inputs: [
      { name: "token", type: "USDT | WETH | USDm | USDC | CELO | EURm", required: true, description: "Token symbol to withdraw from Aave." },
      { name: "amount", type: "string", required: false, description: "Human-readable amount, e.g. '100'. Omit when withdrawMax is true." },
      { name: "withdrawMax", type: "boolean", required: false, description: "Withdraw the full supplied balance of this token from Aave." },
    ],
    returns: "{ hash, status, blockNumber, amountWithdrawn }",
    examples: ["Withdraw all my USDC from Aave.", "Withdraw 0.5 CELO from Aave."],
  },
  {
    name: "verify_self_agent",
    slug: "verify-self-agent",
    title: "Verify Self Agent",
    summary: "Check if an agent is a verified human",
    description:
      "Verify whether an agent address is backed by a real human on Self Agent ID (Celo mainnet). Checks on-chain registration, proof provider, credentials, and proof expiry.",
    kind: "read",
    category: "Self",
    inputs: [
      { name: "agent_address", type: "0x… address", required: true, description: "Agent address to verify." },
      { name: "require_age", type: "0 | 18 | 21", required: false, description: "Minimum age requirement. Defaults to 0 (no age check)." },
      { name: "require_ofac", type: "boolean", required: false, description: "Require OFAC sanctions check. Defaults to false." },
      { name: "require_self_provider", type: "boolean", required: false, description: "Require Self as proof provider. Defaults to true." },
    ],
    returns: "{ isVerified, registration, credentials, proofExpiry, … }",
    examples: ["Is 0x… a verified human on Self?"],
  },
  {
    name: "lookup_self_agent",
    slug: "lookup-self-agent",
    title: "Look Up Self Agent",
    summary: "Resolve a Self Agent ID by numeric ID",
    description:
      "Look up a Self Agent ID by numeric on-chain ID via ai.self.xyz, enriched with on-chain proof expiry from the registry.",
    kind: "read",
    category: "Self",
    inputs: [
      { name: "agent_id", type: "integer", required: true, description: "Numeric on-chain Self Agent ID." },
    ],
    returns: "{ agentId, address, metadata, proofExpiry, … }",
    examples: ["Look up Self agent 42."],
  },
  {
    name: "verify_self_request",
    slug: "verify-self-request",
    title: "Verify Self Agent Request",
    summary: "Validate signed Self agent HTTP headers",
    description:
      "Verify incoming HTTP request headers signed by a Self Agent (x-self-agent-signature, x-self-agent-timestamp). Recovers signer from signature and checks on-chain registration.",
    kind: "read",
    category: "Self",
    inputs: [
      { name: "agent_signature", type: "0x… hex", required: true, description: "x-self-agent-signature header value." },
      { name: "agent_timestamp", type: "string", required: true, description: "x-self-agent-timestamp header value." },
      { name: "method", type: "string", required: true, description: "HTTP method of the signed request." },
      { name: "path", type: "string", required: true, description: "Request path that was signed." },
      { name: "body", type: "string", required: false, description: "Request body that was signed, if any." },
      { name: "keytype", type: "string", required: false, description: "Optional key type hint." },
      { name: "agent_key", type: "0x… hex", required: false, description: "Optional explicit agent public key." },
    ],
    returns: "{ valid, signer, registration }",
  },
  {
    name: "register_self_agent",
    slug: "register-self-agent",
    title: "Register Self Agent",
    summary: "Start Self Agent ID registration (QR flow)",
    description:
      "Start Self Agent ID registration. Returns a QR/deep link for the human to scan with the Self app. Poll with check_self_registration.",
    kind: "write",
    category: "Self",
    inputs: [
      { name: "mode", type: "linked | wallet-free | smartwallet | self-custody | ed25519 | ed25519-linked", required: false, description: "Registration mode. Defaults to wallet-free." },
      { name: "minimum_age", type: "0 | 18 | 21", required: false, description: "Minimum age credential." },
      { name: "ofac", type: "boolean", required: false, description: "Require OFAC check." },
      { name: "human_address", type: "0x… address", required: false, description: "Human's wallet address (for linked modes)." },
      { name: "agent_name", type: "string", required: false, description: "Display name for the agent." },
      { name: "agent_description", type: "string", required: false, description: "Short description of the agent." },
    ],
    returns: "{ sessionId, qrUrl, deepLink, … }",
    examples: ["Register me as a Self agent."],
  },
  {
    name: "check_self_registration",
    slug: "check-self-registration",
    title: "Check Self Registration",
    summary: "Poll a Self registration / refresh session",
    description:
      "Poll a pending Self registration, proof refresh, or deregistration session. Returns private_key_hex when registration completes.",
    kind: "read",
    category: "Self",
    inputs: [
      { name: "session_id", type: "string", required: true, description: "Session ID returned by register_self_agent or refresh_self_proof." },
    ],
    returns: "{ status, agentId?, private_key_hex?, … }",
  },
  {
    name: "get_self_identity",
    slug: "get-self-identity",
    title: "Get Self Agent Identity",
    summary: "On-chain identity for configured Self agent",
    description:
      "Return the configured Self agent's on-chain identity, credentials summary, and proof expiry. Requires SELF_AGENT_PRIVATE_KEY in your MCP client env.",
    kind: "read",
    category: "Self",
    inputs: [
    ],
    returns: "{ agentId, address, credentials, proofExpiry, … }",
  },
  {
    name: "refresh_self_proof",
    slug: "refresh-self-proof",
    title: "Refresh Self Proof",
    summary: "Re-run human proof after expiry",
    description:
      "Start a human proof refresh after on-chain proof expiry (isProofFresh is false). Returns an error while the proof is still fresh. Poll completion with check_self_registration.",
    kind: "write",
    category: "Self",
    inputs: [
      { name: "agent_id", type: "integer", required: false, description: "Optional explicit agent ID." },
    ],
    returns: "{ sessionId, qrUrl, … }",
  },
  {
    name: "deregister_self_agent",
    slug: "deregister-self-agent",
    title: "Deregister Self Agent",
    summary: "Irreversibly deregister a Self agent",
    description:
      "Start irreversible Self agent deregistration. Human must confirm via Self app QR. Poll with check_self_registration.",
    kind: "write",
    category: "Self",
    inputs: [
    ],
    returns: "{ sessionId, qrUrl, … }",
  },
  {
    name: "sign_self_request",
    slug: "sign-self-request",
    title: "Sign Self Agent Request",
    summary: "Produce x-self-agent-* headers for an HTTP call",
    description:
      "Sign an HTTP request with the configured Self agent identity. Returns x-self-agent-* headers for gated APIs. For Self demo endpoints on Celo mainnet, use ?network=celo-mainnet.",
    kind: "read",
    category: "Self",
    inputs: [
      { name: "method", type: "GET | POST | PUT | DELETE", required: true, description: "HTTP method to sign." },
      { name: "url", type: "string (http/https)", required: true, description: "Full URL being signed." },
      { name: "body", type: "string", required: false, description: "Optional request body." },
    ],
    returns: "{ headers: { 'x-self-agent-signature', 'x-self-agent-timestamp', … } }",
  },
  {
    name: "authenticated_self_fetch",
    slug: "authenticated-self-fetch",
    title: "Authenticated Self Fetch",
    summary: "HTTP fetch with Self agent auth applied",
    description:
      "Make an HTTP request with Self Agent ID authentication headers applied automatically. For Self demo endpoints on Celo mainnet, use ?network=celo-mainnet.",
    kind: "write",
    category: "Self",
    inputs: [
      { name: "method", type: "GET | POST | PUT | DELETE", required: true, description: "HTTP method." },
      { name: "url", type: "string (http/https)", required: true, description: "Target URL." },
      { name: "body", type: "string", required: false, description: "Optional request body." },
      { name: "content_type", type: "string", required: false, description: "Content-Type header. Defaults to application/json." },
    ],
    returns: "{ status, headers, body }",
  },
  {
    name: "get_token_balance",
    slug: "get-token-balance",
    title: "Get Token Balance",
    summary: "ERC-20 balance by contract address",
    description:
      "Fetch the ERC-20 balance of a wallet for a token specified by contract address. Returns raw and formatted balance with decimals.",
    kind: "read",
    category: "Token",
    inputs: [
      { name: "address", type: "0x… address", required: true, description: "Wallet to inspect." },
      { name: "token", type: "0x… address", required: true, description: "ERC-20 contract address." },
    ],
    returns: "{ balance, formatted, decimals, symbol }",
    examples: ["What's 0x…'s balance of token 0x…?"],
  },
  {
    name: "get_gas_fee_data",
    slug: "get-gas-fee-data",
    title: "Get Gas Fee Data",
    summary: "Current EIP-1559 gas fees on Celo",
    description:
      "Return current gas fees on Celo mainnet, including EIP-1559 maxFeePerGas and maxPriorityFeePerGas when supported, alongside the legacy gasPrice.",
    kind: "read",
    category: "Blockchain",
    inputs: [],
    returns: "{ gasPrice, maxFeePerGas?, maxPriorityFeePerGas? }",
    examples: ["What are current gas fees on Celo?"],
  },
  {
    name: "estimate_transaction",
    slug: "estimate-transaction",
    title: "Estimate Transaction",
    summary: "Generic gas estimate for any tx",
    description:
      "Estimate gas for an arbitrary transaction on Celo mainnet from from/to/value/data fields. Useful for raw contract calls before sending.",
    kind: "read",
    category: "Transaction",
    inputs: [
      { name: "from", type: "0x… address", required: true, description: "Sender address." },
      { name: "to", type: "0x… address", required: true, description: "Recipient or contract address." },
      { name: "value", type: "string (wei)", required: false, description: "Native CELO value in wei. Defaults to 0." },
      { name: "data", type: "0x… hex", required: false, description: "Calldata for the transaction." },
    ],
    returns: "{ gasLimit, gasPrice, estimatedFee }",
    examples: ["Estimate gas to call this contract from 0x…"],
  },
  {
    name: "get_governance_proposals",
    slug: "get-governance-proposals",
    title: "Get Governance Proposals",
    summary: "Paginated Celo governance proposals",
    description:
      "List Celo governance proposals (queued, approved, referendum, execution, expiration) with pagination. Includes proposer, stage, and vote totals.",
    kind: "read",
    category: "Governance",
    inputs: [
      { name: "stage", type: "Queued | Approval | Referendum | Execution | Expiration | All", required: false, description: "Filter by governance stage. Defaults to all." },
      { name: "limit", type: "integer (1-50)", required: false, description: "Page size. Defaults to 10." },
      { name: "offset", type: "integer", required: false, description: "Pagination offset." },
    ],
    returns: "Array of proposal summaries with stage, deposit, and vote totals.",
    examples: ["List the latest Celo governance proposals."],
  },
  {
    name: "get_proposal_details",
    slug: "get-proposal-details",
    title: "Get Proposal Details",
    summary: "Single proposal + CGP content",
    description:
      "Fetch full details for a Celo governance proposal by ID, including on-chain stage, vote tallies, and the linked Celo Governance Proposal (CGP) markdown content when available.",
    kind: "read",
    category: "Governance",
    inputs: [
      { name: "proposal_id", type: "integer", required: true, description: "Numeric governance proposal ID." },
    ],
    returns: "{ id, stage, proposer, votes, transactions, cgp? }",
    examples: ["Show me details of Celo proposal 198."],
  },
  {
    name: "get_staking_balances",
    slug: "get-staking-balances",
    title: "Get Staking Balances",
    summary: "Staking votes by validator group",
    description:
      "Return an address's staking votes on Celo mainnet, broken down by validator group, including active and pending amounts.",
    kind: "read",
    category: "Staking",
    inputs: [
      { name: "address", type: "0x… address", required: true, description: "Account to inspect." },
    ],
    returns: "{ groups: [{ group, active, pending }], totals }",
    examples: ["What does 0x… have staked on Celo?"],
  },
  {
    name: "get_activatable_stakes",
    slug: "get-activatable-stakes",
    title: "Get Activatable Stakes",
    summary: "Pending stakes ready to activate",
    description:
      "Return any pending staking votes for an address that are now eligible to be activated on Celo mainnet.",
    kind: "read",
    category: "Staking",
    inputs: [
      { name: "address", type: "0x… address", required: true, description: "Account to inspect." },
    ],
    returns: "Array of { group, pendingAmount, activatableSince }.",
    examples: ["Do I have any Celo stakes ready to activate?"],
  },
  {
    name: "get_validator_groups",
    slug: "get-validator-groups",
    title: "Get Validator Groups",
    summary: "Paginated validator groups",
    description:
      "List Celo validator groups with pagination — name, address, members, and total votes.",
    kind: "read",
    category: "Staking",
    inputs: [
      { name: "limit", type: "integer (1-100)", required: false, description: "Page size. Defaults to 20." },
      { name: "offset", type: "integer", required: false, description: "Pagination offset." },
    ],
    returns: "Array of validator group summaries.",
    examples: ["List the top Celo validator groups."],
  },
  {
    name: "get_validator_group_details",
    slug: "get-validator-group-details",
    title: "Get Validator Group Details",
    summary: "Single validator group details",
    description:
      "Fetch full details for a single Celo validator group by address — members, votes, commission, and slashing history.",
    kind: "read",
    category: "Staking",
    inputs: [
      { name: "group", type: "0x… address", required: true, description: "Validator group address." },
    ],
    returns: "{ name, address, members, votes, commission, … }",
    examples: ["Show me details for validator group 0x…"],
  },
  {
    name: "get_total_staking_info",
    slug: "get-total-staking-info",
    title: "Get Total Staking Info",
    summary: "Network-wide staking totals",
    description:
      "Return network-wide staking totals on Celo: total locked, total votes, number of elected validators, and current epoch info.",
    kind: "read",
    category: "Staking",
    inputs: [],
    returns: "{ totalLocked, totalVotes, electedValidators, epoch }",
    examples: ["How much CELO is staked network-wide?"],
  },
  {
    name: "get_nft_info",
    slug: "get-nft-info",
    title: "Get NFT Info",
    summary: "NFT token info + metadata",
    description:
      "Fetch info and metadata for an NFT on Celo — supports ERC-721 and ERC-1155. Resolves tokenURI and parses metadata when available.",
    kind: "read",
    category: "NFT",
    inputs: [
      { name: "contract", type: "0x… address", required: true, description: "NFT contract address." },
      { name: "token_id", type: "string", required: true, description: "Token ID." },
      { name: "standard", type: "erc721 | erc1155", required: false, description: "Token standard. Auto-detected when omitted." },
    ],
    returns: "{ contract, tokenId, owner?, tokenURI, metadata }",
    examples: ["Show me NFT #42 from contract 0x…"],
  },
  {
    name: "get_nft_balance",
    slug: "get-nft-balance",
    title: "Get NFT Balance",
    summary: "ERC-721 / ERC-1155 balance",
    description:
      "Return the NFT balance of a wallet for a given contract — count for ERC-721 or per-token balance for ERC-1155.",
    kind: "read",
    category: "NFT",
    inputs: [
      { name: "address", type: "0x… address", required: true, description: "Wallet to inspect." },
      { name: "contract", type: "0x… address", required: true, description: "NFT contract address." },
      { name: "token_id", type: "string", required: false, description: "Required for ERC-1155." },
      { name: "standard", type: "erc721 | erc1155", required: false, description: "Token standard. Auto-detected when omitted." },
    ],
    returns: "{ balance, standard }",
    examples: ["How many NFTs of contract 0x… does 0x… own?"],
  },
  {
    name: "call_contract_function",
    slug: "call-contract-function",
    title: "Call Contract Function",
    summary: "Read-only contract call with caller ABI",
    description:
      "Make a read-only call to any Celo mainnet contract using a caller-supplied ABI fragment. No wallet required; does not broadcast.",
    kind: "read",
    category: "Contract",
    inputs: [
      { name: "contract", type: "0x… address", required: true, description: "Contract address." },
      { name: "abi", type: "JSON ABI fragment", required: true, description: "Function ABI as JSON." },
      { name: "function", type: "string", required: true, description: "Function name to call." },
      { name: "args", type: "any[]", required: false, description: "Function arguments in order." },
    ],
    returns: "Decoded function return value(s).",
    examples: ["Call totalSupply() on contract 0x…"],
  },
  {
    name: "estimate_contract_gas",
    slug: "estimate-contract-gas",
    title: "Estimate Contract Gas",
    summary: "Gas estimate for a contract call",
    description:
      "Estimate gas for invoking a contract function on Celo mainnet with a caller-supplied ABI fragment. Does not broadcast.",
    kind: "read",
    category: "Contract",
    inputs: [
      { name: "from", type: "0x… address", required: true, description: "Sender address." },
      { name: "contract", type: "0x… address", required: true, description: "Contract address." },
      { name: "abi", type: "JSON ABI fragment", required: true, description: "Function ABI as JSON." },
      { name: "function", type: "string", required: true, description: "Function name." },
      { name: "args", type: "any[]", required: false, description: "Function arguments in order." },
      { name: "value", type: "string (wei)", required: false, description: "Native CELO value to attach. Defaults to 0." },
    ],
    returns: "{ gasLimit, gasPrice, estimatedFee }",
    examples: ["Estimate gas to mint() on contract 0x… from 0x…"],
  },
];


export const TOOL_BY_SLUG: Record<string, ToolDoc> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t]),
);

export function categorySlug(category: ToolDoc["category"]): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const CATEGORY_SLUGS = Array.from(
  new Set(TOOLS.map((t) => categorySlug(t.category))),
);

export const CATEGORY_BY_SLUG: Record<string, ToolDoc["category"]> =
  Object.fromEntries(TOOLS.map((t) => [categorySlug(t.category), t.category]));

export function findTool(catSlug: string, toolSlug: string): ToolDoc | undefined {
  return TOOLS.find(
    (t) => categorySlug(t.category) === catSlug && t.slug === toolSlug,
  );
}