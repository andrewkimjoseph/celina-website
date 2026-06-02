export type ToolKind = "read" | "write" | "prepare";
export type ToolAvailability = "hosted" | "stdio" | "both";

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
  /** Where the tool is registered: hosted endpoint, local stdio, or both */
  availability?: ToolAvailability;
  category: "Blockchain" | "Account" | "Token" | "Transaction" | "Mento FX" | "Uniswap" | "Wallet" | "GoodDollar" | "Aave" | "Carbon DeFi" | "Self" | "Governance" | "Staking" | "NFT" | "Contract";
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
    description: "Fetch a Celo mainnet block by number, by hash, or pass 'latest' to get the head block. Optionally include full transaction objects.",
    kind: "read",
    category: "Blockchain",
    inputs: [
      { name: "blockId", type: "number | hex | 'latest'", required: true, description: "Block number, 0x-prefixed hash, or the literal 'latest'." },
      { name: "includeTransactions", type: "boolean", required: false, description: "Include full transaction objects in the response. Defaults to false." },
    ],
    returns: "Block object with hash, parentHash, timestamp, transactions, gas info.",
    examples: ["Show me block 30000000 on Celo."],
  },
  {
    name: "get_latest_blocks",
    slug: "get-latest-blocks",
    title: "Get Latest Blocks",
    summary: "Most recent blocks on Celo mainnet",
    description: "Fetch the N most recent blocks on Celo mainnet, newest first. Up to 100 per call, with optional offset for pagination.",
    kind: "read",
    category: "Blockchain",
    inputs: [
      { name: "count", type: "integer (1-100)", required: false, description: "How many recent blocks to return. Defaults to 5." },
      { name: "offset", type: "integer", required: false, description: "Skip this many blocks from the head before returning results." },
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
    name: "get_wallet_address",
    slug: "get-wallet-address",
    title: "Get Wallet Address",
    summary: "Signer address from CELO_PRIVATE_KEY",
    description:
      "Returns the wallet address derived from CELO_PRIVATE_KEY in the server env. Use when you need the signer explicitly; omit address on other tools to default to this wallet when the key is configured.",
    kind: "read",
    category: "Account",
    inputs: [],
    returns: "{ wallet_address, has_wallet, source }",
    examples: ["What is my wallet address?"],
    availability: "stdio",
  },
  {
    name: "get_account",
    slug: "get-account",
    title: "Get Account",
    summary: "Native CELO balance, nonce, contract flag",
    description:
      "Returns the native CELO balance, current nonce, and whether the address is a contract on Celo mainnet. Omit address on local stdio when CELO_PRIVATE_KEY is set to use the configured signer.",
    kind: "read",
    category: "Account",
    inputs: [
      {
        name: "address",
        type: "0x… address",
        required: false,
        description: "Celo mainnet account to inspect. Defaults to the configured signer when CELO_PRIVATE_KEY is set.",
      },
    ],
    returns: "{ balance (wei + formatted), nonce, isContract }",
    examples: ["How much CELO does 0x… hold?", "What is my CELO balance?"],
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
    summary: "Named registry token balances (default: CELO + USDm)",
    description:
      "Named registry token balances (default: CELO + USDm).",
    kind: "read",
    category: "Token",
    inputs: [
      {
        name: "address",
        type: "0x… address",
        required: false,
        description: "Address to query. Defaults to the configured signer on local stdio with CELO_PRIVATE_KEY.",
      },
      { name: "tokens", type: "string[]", required: false, description: "Token symbols or addresses to include (e.g. ['CELO','USDm','cUSD'])." },
    ],
    returns: "Array of { symbol, address, balance, decimals, formatted }.",
    examples: ["What does 0x… hold in CELO and USDm?", "What are my CELO and USDm balances?"],
  },
  {
    name: "get_stablecoin_balances",
    slug: "get-stablecoin-balances",
    title: "Get Stablecoin Balances",
    summary: "Scan all registry stablecoins; omits zero balances by default",
    description:
      "Scan all registry stablecoins; omits zero balances by default.",
    kind: "read",
    category: "Token",
    inputs: [
      {
        name: "address",
        type: "0x… address",
        required: false,
        description: "Address to query. Defaults to the configured signer on local stdio with CELO_PRIVATE_KEY.",
      },
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
    summary: "Registry token metadata (no balance read)",
    description: "Registry token metadata (no balance read).",
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
    name: "get_gooddollar_ubi_entitlement",
    slug: "get-gooddollar-ubi-entitlement",
    title: "Get GoodDollar UBI Entitlement",
    summary: "Daily UBI claim eligibility (amount, root, reasons)",
    description:
      "Check whether an address can claim today's GoodDollar UBI on Celo mainnet — returns the claimable G$ amount, the resolved whitelist root, and any reasons the claim is blocked.",
    kind: "read",
    category: "GoodDollar",
    inputs: [
      { name: "address", type: "0x… address", required: true, description: "Wallet to check entitlement for." },
    ],
    returns: "{ canClaim, claimableAmount, whitelistedRoot, reasons }",
    examples: ["Can 0x… claim GoodDollar UBI today?"],
  },
  {
    name: "claim_daily_gooddollar_ubi",
    slug: "claim-daily-gooddollar-ubi",
    title: "Claim Daily GoodDollar UBI",
    summary: "Claim today's GoodDollar UBI (G$)",
    description:
      "Claim today's GoodDollar UBI for the MCP server wallet on Celo mainnet. G$ is sent to the signer; gas is paid in CELO. One claim per verified identity per day. Requires CELO_PRIVATE_KEY in your MCP client env.",
    kind: "write",
    category: "GoodDollar",
    inputs: [],
    returns: "{ hash, status, amountClaimed, blockNumber }",
    examples: ["Claim today's GoodDollar UBI."],
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
    examples: ["Estimate gas to convert 100 USDm to EURm via Mento."],
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
    name: "get_uniswap_quote",
    slug: "get-uniswap-quote",
    title: "Get Uniswap Quote",
    summary: "Uniswap v4 expected output for a token pair",
    description:
      "Get an expected Uniswap v4 swap output on Celo mainnet for a token pair (e.g. G$ → USDT, USDC → USDT). Read-only and wallet-free. CELO swaps route through WCELO pools.",
    kind: "read",
    category: "Uniswap",
    inputs: [
      { name: "tokenIn", type: "symbol or 0x…", required: true, description: "Input token (use WCELO for CELO swaps)." },
      { name: "tokenOut", type: "symbol or 0x…", required: true, description: "Output token." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount of tokenIn, e.g. '100'." },
    ],
    returns: "{ amountIn, expectedOut, route, pool }",
    examples: ["Quote 1000 G$ to USDT on Uniswap.", "Quote 50 USDC to USDT on Uniswap v4."],
  },
  {
    name: "estimate_uniswap_swap",
    slug: "estimate-uniswap-swap",
    title: "Estimate Uniswap Swap",
    summary: "Gas estimate for a Uniswap v4 swap",
    description:
      "Estimate gas for a Uniswap v4 swap on Celo mainnet, including any required ERC-20 approve and Permit2 approve steps. Does not broadcast. Requires CELO_PRIVATE_KEY in your MCP client env.",
    kind: "read",
    category: "Uniswap",
    inputs: [
      { name: "tokenIn", type: "symbol or 0x…", required: true, description: "Input token (use WCELO for CELO swaps)." },
      { name: "tokenOut", type: "symbol or 0x…", required: true, description: "Output token." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount of tokenIn." },
      { name: "recipient", type: "0x… address", required: false, description: "Address that receives output tokens. Defaults to the signer." },
      { name: "slippageTolerance", type: "number (0-20)", required: false, description: "Max slippage in percent. Defaults to 0.5." },
      { name: "deadlineMinutes", type: "integer", required: false, description: "Transaction deadline in minutes. Defaults to 5." },
    ],
    returns: "{ approvalGas?, permit2Gas?, swapGas, totalGas, estimatedCostWei }",
    examples: ["Estimate gas to swap 1000 G$ to USDT on Uniswap v4."],
  },
  {
    name: "execute_uniswap_swap",
    slug: "execute-uniswap-swap",
    title: "Execute Uniswap Swap",
    summary: "Swap via Uniswap v4 Universal Router + Permit2",
    description:
      "Execute a Uniswap v4 swap on Celo mainnet via the Universal Router with Permit2. Sends any required ERC-20 approve and Permit2 approve steps first, then the swap. CELO swaps require WCELO balance on the signer. Requires CELO_PRIVATE_KEY in your MCP client env. All on-chain steps include the CELINA attribution tag.",
    kind: "write",
    category: "Uniswap",
    inputs: [
      { name: "tokenIn", type: "symbol or 0x…", required: true, description: "Input token (use WCELO for CELO swaps)." },
      { name: "tokenOut", type: "symbol or 0x…", required: true, description: "Output token." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount of tokenIn." },
      { name: "recipient", type: "0x… address", required: false, description: "Address that receives output tokens. Defaults to the signer." },
      { name: "slippageTolerance", type: "number (0-20)", required: false, description: "Max slippage in percent. Defaults to 0.5." },
      { name: "deadlineMinutes", type: "integer", required: false, description: "Transaction deadline in minutes. Defaults to 5." },
    ],
    returns: "{ approvalHash?, permit2Hash?, swapHash, status, blockNumber }",
    examples: ["Swap 1000 G$ to USDT on Uniswap.", "Swap 25 USDC to USDT via Uniswap v4."],
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
    examples: ["Verify this signed Self agent request from these headers."],
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
    examples: ["Check the status of my Self registration session."],
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
    examples: ["What's my Self agent identity and proof status?"],
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
    examples: ["Refresh my Self human proof."],
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
    examples: ["Deregister my Self agent."],
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
    examples: ["Sign a GET request to https://api.self.xyz/me as my Self agent."],
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
    examples: ["Fetch https://api.self.xyz/me with my Self agent credentials."],
  },
  {
    name: "get_token_balance",
    slug: "get-token-balance",
    title: "Get Token Balance",
    summary: "Single registry token balance (symbol or known registry address)",
    description:
      "Single registry token balance (symbol or known registry address).",
    kind: "read",
    category: "Token",
    inputs: [
      {
        name: "address",
        type: "0x… address",
        required: false,
        description: "Wallet to inspect. Defaults to the configured signer on local stdio with CELO_PRIVATE_KEY.",
      },
      { name: "token", type: "symbol or 0x…", required: true, description: "Registry token symbol or address." },
    ],
    returns: "{ balance, formatted, decimals, symbol }",
    examples: ["What's 0x…'s balance of token 0x…?", "What's my USDT balance?"],
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
  // ─── Carbon DeFi on Celo ───────────────────────────────────────────────
  {
    name: "get_carbon_strategies",
    slug: "get-carbon-strategies",
    title: "Get Carbon Strategies",
    summary: "Active maker strategies for a wallet",
    description:
      "List active Carbon DeFi maker strategies owned by a wallet on Celo mainnet. Call before creating or managing strategies to avoid duplicates. Omit wallet_address on local stdio when CELO_PRIVATE_KEY is set.",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      {
        name: "wallet_address",
        type: "0x… address",
        required: false,
        description: "Wallet to inspect. Defaults to the configured signer on local stdio with CELO_PRIVATE_KEY.",
      },
    ],
    returns: "Array of strategy summaries (id, pair, type, status, budgets).",
    examples: ["What Carbon strategies does 0x… have running?"],
  },
  {
    name: "get_carbon_strategy",
    slug: "get-carbon-strategy",
    title: "Get Carbon Strategy",
    summary: "Single strategy details by NFT id",
    description:
      "Fetch a Carbon DeFi strategy by its NFT id — status, price ranges, budgets, and recent fills.",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      { name: "strategy_id", type: "string | integer", required: true, description: "Carbon strategy NFT id." },
    ],
    returns: "{ id, pair, type, status, prices, budgets, fills }",
    examples: ["Show me Carbon strategy 1234."],
  },
  {
    name: "get_carbon_trade_quote",
    slug: "get-carbon-trade-quote",
    title: "Get Carbon Trade Quote",
    summary: "Taker swap quote against Carbon liquidity",
    description:
      "Get a taker swap quote against Carbon liquidity on Celo mainnet. Falls back to the @bancor/carbon-sdk locally if the Carbon REST API fails.",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      { name: "tokenIn", type: "symbol or 0x…", required: true, description: "Input token." },
      { name: "tokenOut", type: "symbol or 0x…", required: true, description: "Output token." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount of tokenIn." },
    ],
    returns: "{ amountIn, expectedOut, route, source }",
    examples: ["Quote 100 USDC to USDT on Carbon."],
  },
  {
    name: "explore_carbon_pair",
    slug: "explore-carbon-pair",
    title: "Explore Carbon Pair",
    summary: "Liquidity + top strategies for a pair",
    description:
      "Explore Carbon liquidity for a base/quote pair on Celo mainnet — total depth and top maker strategies on each side.",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      { name: "base", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote", type: "symbol or 0x…", required: true, description: "Quote token." },
    ],
    returns: "{ pair, buyDepth, sellDepth, topStrategies }",
    examples: ["Explore Carbon liquidity for USDC/USDT."],
  },
  {
    name: "resolve_carbon_token",
    slug: "resolve-carbon-token",
    title: "Resolve Carbon Token",
    summary: "Symbol → Celo token address (Carbon)",
    description:
      "Resolve a token symbol or name to its Celo mainnet address using the Carbon API first, with a fallback to the Celina registry.",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      { name: "query", type: "string", required: true, description: "Symbol or name (e.g. 'USDC', 'cUSD')." },
    ],
    returns: "{ symbol, name, address, decimals, source }",
    examples: ["Resolve the USDC token on Carbon."],
  },
  {
    name: "get_carbon_activity",
    slug: "get-carbon-activity",
    title: "Get Carbon Activity",
    summary: "Trade & event history for wallet or strategy",
    description:
      "Fetch trade and event history for a Carbon wallet or specific strategy on Celo mainnet.",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      {
        name: "wallet_address",
        type: "0x… address",
        required: false,
        description:
          "Wallet to inspect (mutually exclusive with strategy_id). Defaults to the configured signer on local stdio with CELO_PRIVATE_KEY.",
      },
      { name: "strategy_id", type: "string", required: false, description: "Strategy NFT id." },
    ],
    returns: "Array of activity events (trades, deposits, withdrawals, edits).",
    examples: ["Show recent Carbon trades for 0x…", "Show my recent Carbon activity."],
  },
  {
    name: "find_carbon_opportunities",
    slug: "find-carbon-opportunities",
    title: "Find Carbon Opportunities",
    summary: "Discount buys / premium sells vs market",
    description:
      "Scan Carbon strategies on a pair for discount buys or premium sells relative to current market price.",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      { name: "base", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote", type: "symbol or 0x…", required: true, description: "Quote token." },
    ],
    returns: "{ discounts: [...], premiums: [...] }",
    examples: ["Find discount buys on Carbon for USDC/USDT."],
  },
  {
    name: "get_carbon_protocol_stats",
    slug: "get-carbon-protocol-stats",
    title: "Get Carbon Protocol Stats",
    summary: "TVL, volume, fees",
    description:
      "Return Carbon DeFi protocol-wide stats on Celo mainnet — TVL, volume, fees. Optional rolling window.",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      { name: "period_days", type: "integer (1-30)", required: false, description: "Rolling window in days. Defaults to 1." },
    ],
    returns: "{ tvl, volume, fees, period_days }",
    examples: ["What's Carbon's TVL and 7-day volume on Celo?"],
  },
  {
    name: "get_carbon_price_history",
    slug: "get-carbon-price-history",
    title: "Get Carbon Price History",
    summary: "Historical OHLC for a pair",
    description:
      "Historical OHLC price data for a Carbon-supported pair on Celo mainnet.",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      { name: "base", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "period_days", type: "integer", required: false, description: "Lookback in days." },
    ],
    returns: "Array of OHLC candles.",
    examples: ["Show 30-day price history for USDC/USDT on Carbon."],
  },
  {
    name: "simulate_carbon_strategy",
    slug: "simulate-carbon-strategy",
    title: "Simulate Carbon Strategy",
    summary: "Backtest a strategy config",
    description:
      "Backtest a Carbon strategy configuration (up to 365 days) against historical prices before committing capital.",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      { name: "base", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "config", type: "object", required: true, description: "Strategy config (type, prices, budgets)." },
      { name: "period_days", type: "integer (1-365)", required: false, description: "Backtest window." },
    ],
    returns: "{ trades, pnl, finalBudgets, summary }",
    examples: ["Backtest a USDC/USDT recurring strategy for 30 days."],
  },
  {
    name: "carbon_help",
    slug: "carbon-help",
    title: "Carbon Help",
    summary: "Per-tool guidance",
    description:
      "Return per-tool guidance for the Carbon DeFi tool family. Pass an optional topic for a specific tool.",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      { name: "topic", type: "string", required: false, description: "Specific tool name." },
    ],
    returns: "Markdown help text.",
    examples: ["How does prepare_carbon_recurring_strategy work?"],
  },
  {
    name: "carbon_learn",
    slug: "carbon-learn",
    title: "Carbon Learn",
    summary: "Protocol education topics",
    description:
      "Return educational content about Carbon DeFi — strategy types, mechanics, fees. Pass an optional topic (e.g. 'recurring_strategy').",
    kind: "read",
    category: "Carbon DeFi",
    inputs: [
      { name: "topic", type: "string", required: false, description: "Topic name." },
    ],
    returns: "Markdown explainer.",
    examples: ["Explain how Carbon recurring strategies work."],
  },
  {
    name: "prepare_carbon_limit_order",
    slug: "prepare-carbon-limit-order",
    title: "Prepare Carbon Limit Order",
    summary: "One-time limit order",
    description:
      "Create a one-time Carbon limit order on Celo. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    availability: "both",
    category: "Carbon DeFi",
    inputs: [
      { name: "base", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "side", type: "buy | sell", required: true, description: "Order side." },
      { name: "price", type: "string", required: true, description: "Limit price (quote per 1 base)." },
      { name: "amount", type: "string", required: true, description: "Order budget (quote for buy, base for sell)." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Prepare a limit buy 1000 USDC at 0.999 USDC/USDT."],
  },
  {
    name: "prepare_carbon_range_order",
    slug: "prepare-carbon-range-order",
    title: "Prepare Carbon Range Order",
    summary: "Range order — gradual fill",
    description:
      "Prepare a Carbon range order that executes gradually across a price band. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "base", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "side", type: "buy | sell", required: true, description: "Order side." },
      { name: "lowPrice", type: "string", required: true, description: "Low end of price range." },
      { name: "highPrice", type: "string", required: true, description: "High end of price range." },
      { name: "amount", type: "string", required: true, description: "Total budget." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Prepare a Carbon range buy of 500 USDC between 0.995 and 0.999 USDT."],
  },
  {
    name: "prepare_carbon_recurring_strategy",
    slug: "prepare-carbon-recurring-strategy",
    title: "Prepare Carbon Recurring Strategy",
    summary: "Recurring buy/sell strategy",
    description:
      "Prepare a Carbon recurring strategy — automatic buy-low/sell-high. Makers pay no gas on fills. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "base", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "buyRange", type: "{ low, high }", required: true, description: "Buy price range (quote per 1 base)." },
      { name: "sellRange", type: "{ low, high }", required: true, description: "Sell price range." },
      { name: "buyBudget", type: "string", required: true, description: "Buy budget in quote token." },
      { name: "sellBudget", type: "string", required: true, description: "Sell budget in base token." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Run a recurring USDC/USDT strategy between 0.998 and 1.002."],
  },
  {
    name: "prepare_carbon_concentrated_strategy",
    slug: "prepare-carbon-concentrated-strategy",
    title: "Prepare Carbon Concentrated Strategy",
    summary: "Concentrated two-sided liquidity",
    description:
      "Prepare a Carbon concentrated two-sided liquidity strategy in a tight price range. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "base", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "centerPrice", type: "string", required: true, description: "Center price." },
      { name: "width", type: "string", required: true, description: "Range width (percent or absolute)." },
      { name: "buyBudget", type: "string", required: true, description: "Quote budget." },
      { name: "sellBudget", type: "string", required: true, description: "Base budget." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Prepare a concentrated USDC/USDT strategy centered at 1.000 with 0.2% width."],
  },
  {
    name: "prepare_carbon_full_range_strategy",
    slug: "prepare-carbon-full-range-strategy",
    title: "Prepare Carbon Full-Range Strategy",
    summary: "Full-range liquidity",
    description:
      "Prepare a Carbon full-range liquidity strategy — passive market making across the entire price curve. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "base", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "buyBudget", type: "string", required: true, description: "Quote budget." },
      { name: "sellBudget", type: "string", required: true, description: "Base budget." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Prepare a full-range CELO/USDC Carbon strategy."],
  },
  {
    name: "prepare_carbon_reprice_strategy",
    slug: "prepare-carbon-reprice-strategy",
    title: "Prepare Carbon Reprice Strategy",
    summary: "Update price ranges",
    description:
      "Prepare a update to the price ranges of an existing Carbon strategy. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
      { name: "buyRange", type: "{ low, high }", required: false, description: "New buy range." },
      { name: "sellRange", type: "{ low, high }", required: false, description: "New sell range." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Reprice Carbon strategy 1234 to a new buy range."],
  },
  {
    name: "prepare_carbon_edit_strategy",
    slug: "prepare-carbon-edit-strategy",
    title: "Prepare Carbon Edit Strategy",
    summary: "Edit prices, budgets, type",
    description:
      "Prepare a edit to an existing Carbon strategy — change prices, budgets, and optionally the strategy type. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
      { name: "updates", type: "object", required: true, description: "Fields to update." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Edit Carbon strategy 1234's budgets and prices."],
  },
  {
    name: "prepare_carbon_deposit_budget",
    slug: "prepare-carbon-deposit-budget",
    title: "Prepare Carbon Deposit Budget",
    summary: "Add funds to strategy",
    description:
      "Prepare a deposit of additional funds into an existing Carbon strategy. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
      { name: "buyBudget", type: "string", required: false, description: "Additional quote budget." },
      { name: "sellBudget", type: "string", required: false, description: "Additional base budget." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Deposit 100 USDC into Carbon strategy 1234."],
  },
  {
    name: "prepare_carbon_withdraw_budget",
    slug: "prepare-carbon-withdraw-budget",
    title: "Prepare Carbon Withdraw Budget",
    summary: "Withdraw funds from strategy",
    description:
      "Prepare a withdrawal of funds from an existing Carbon strategy. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
      { name: "buyBudget", type: "string", required: false, description: "Quote amount to withdraw." },
      { name: "sellBudget", type: "string", required: false, description: "Base amount to withdraw." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Withdraw 50 USDC from Carbon strategy 1234."],
  },
  {
    name: "prepare_carbon_pause_strategy",
    slug: "prepare-carbon-pause-strategy",
    title: "Prepare Carbon Pause Strategy",
    summary: "Pause strategy; funds remain",
    description:
      "Prepare a pause for an active Carbon strategy. Funds remain on-chain. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Pause Carbon strategy 1234."],
  },
  {
    name: "prepare_carbon_resume_strategy",
    slug: "prepare-carbon-resume-strategy",
    title: "Prepare Carbon Resume Strategy",
    summary: "Resume paused strategy",
    description:
      "Prepare a resume for a paused Carbon strategy. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Resume Carbon strategy 1234."],
  },
  {
    name: "prepare_carbon_delete_strategy",
    slug: "prepare-carbon-delete-strategy",
    title: "Prepare Carbon Delete Strategy",
    summary: "Permanently close strategy",
    description:
      "Prepare a permanent close of a Carbon strategy, withdrawing all remaining funds. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Close Carbon strategy 1234 and withdraw funds."],
  },
  {
    name: "prepare_carbon_trade",
    slug: "prepare-carbon-trade",
    title: "Prepare Carbon Trade",
    summary: "Taker swap against Carbon",
    description:
      "Prepare a taker swap against Carbon liquidity on Celo mainnet. Returns unsigned steps (ERC-20 approve + Carbon controller tx), warnings, and optional deep_link. Available on hosted MCP and local stdio. User signs externally; prices are quote per base; buy budget in quote, sell budget in base.",
    kind: "prepare",
    category: "Carbon DeFi",
    inputs: [
      { name: "tokenIn", type: "symbol or 0x…", required: true, description: "Input token." },
      { name: "tokenOut", type: "symbol or 0x…", required: true, description: "Output token." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount of tokenIn." },
      { name: "slippageTolerance", type: "number (0-20)", required: false, description: "Max slippage in percent. Defaults to 0.5." },
    ],
    returns: "{ preparedFlow, warnings, deep_link? }",
    examples: ["Swap 100 USDC to USDT against Carbon liquidity."],
  },
  {
    name: "execute_carbon_limit_order",
    slug: "execute-carbon-limit-order",
    title: "Execute Carbon Limit Order",
    summary: "Broadcast one-time limit order",
    description:
      "Create and broadcast a one-time Carbon limit order on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally (ERC-20 approve + Carbon tx when needed). Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "base_token", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote_token", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "direction", type: "buy | sell", required: true, description: "Order side." },
      { name: "price", type: "number", required: true, description: "Limit price (quote per 1 base)." },
      { name: "budget", type: "number", required: true, description: "Order budget (quote for buy, base for sell)." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Execute a limit buy 1000 USDC at 0.999 USDC/USDT."],
  },
  {
    name: "execute_carbon_range_order",
    slug: "execute-carbon-range-order",
    title: "Execute Carbon Range Order",
    summary: "Broadcast range order",
    description:
      "Create and broadcast a Carbon range order on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally (ERC-20 approve + Carbon tx when needed). Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "base_token", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote_token", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "direction", type: "buy | sell", required: true, description: "Order side." },
      { name: "price_low", type: "number", required: true, description: "Low end of price range." },
      { name: "price_high", type: "number", required: true, description: "High end of price range." },
      { name: "budget", type: "number", required: true, description: "Total budget." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Execute a Carbon range buy of 500 USDC between 0.995 and 0.999 USDT."],
  },
  {
    name: "execute_carbon_recurring_strategy",
    slug: "execute-carbon-recurring-strategy",
    title: "Execute Carbon Recurring Strategy",
    summary: "Broadcast recurring strategy",
    description:
      "Create and broadcast a recurring buy/sell Carbon strategy on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally (ERC-20 approve + Carbon tx when needed). Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "base_token", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote_token", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "buy_price_low", type: "number", required: true, description: "Buy range low (quote per 1 base)." },
      { name: "buy_price_high", type: "number", required: true, description: "Buy range high." },
      { name: "sell_price_low", type: "number", required: true, description: "Sell range low." },
      { name: "sell_price_high", type: "number", required: true, description: "Sell range high." },
      { name: "buy_budget", type: "number", required: true, description: "Buy budget in quote token." },
      { name: "sell_budget", type: "number", required: true, description: "Sell budget in base token." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Run a recurring USDC/USDT strategy between 0.998 and 1.002."],
  },
  {
    name: "execute_carbon_concentrated_strategy",
    slug: "execute-carbon-concentrated-strategy",
    title: "Execute Carbon Concentrated Strategy",
    summary: "Broadcast concentrated strategy",
    description:
      "Create and broadcast concentrated two-sided Carbon liquidity on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally (ERC-20 approve + Carbon tx when needed). Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "base_token", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote_token", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "spread_percentage", type: "number", required: true, description: "Range width around market price." },
      { name: "buy_budget", type: "number", required: true, description: "Quote budget." },
      { name: "sell_budget", type: "number", required: true, description: "Base budget." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Execute a concentrated USDC/USDT strategy centered at 1.000 with 0.2% width."],
  },
  {
    name: "execute_carbon_full_range_strategy",
    slug: "execute-carbon-full-range-strategy",
    title: "Execute Carbon Full-Range Strategy",
    summary: "Broadcast full-range strategy",
    description:
      "Create and broadcast full-range Carbon liquidity on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally (ERC-20 approve + Carbon tx when needed). Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "base_token", type: "symbol or 0x…", required: true, description: "Base token." },
      { name: "quote_token", type: "symbol or 0x…", required: true, description: "Quote token." },
      { name: "spread_percentage", type: "number", required: true, description: "Full-range spread." },
      { name: "buy_budget", type: "number", required: true, description: "Quote budget." },
      { name: "sell_budget", type: "number", required: true, description: "Base budget." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Execute a full-range CELO/USDC Carbon strategy."],
  },
  {
    name: "execute_carbon_reprice_strategy",
    slug: "execute-carbon-reprice-strategy",
    title: "Execute Carbon Reprice Strategy",
    summary: "Broadcast reprice update",
    description:
      "Update price ranges of an existing Carbon strategy on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally. Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
      { name: "buy_price_low", type: "number", required: false, description: "New buy range low." },
      { name: "buy_price_high", type: "number", required: false, description: "New buy range high." },
      { name: "sell_price_low", type: "number", required: false, description: "New sell range low." },
      { name: "sell_price_high", type: "number", required: false, description: "New sell range high." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Reprice Carbon strategy 1234 to a new buy range."],
  },
  {
    name: "execute_carbon_edit_strategy",
    slug: "execute-carbon-edit-strategy",
    title: "Execute Carbon Edit Strategy",
    summary: "Broadcast strategy edit",
    description:
      "Edit prices and budgets of a Carbon strategy on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally. Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
      { name: "updates", type: "object", required: true, description: "Fields to update." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Edit Carbon strategy 1234's budgets and prices."],
  },
  {
    name: "execute_carbon_deposit_budget",
    slug: "execute-carbon-deposit-budget",
    title: "Execute Carbon Deposit Budget",
    summary: "Broadcast deposit to strategy",
    description:
      "Add funds to a Carbon strategy on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally (ERC-20 approve + Carbon tx when needed). Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
      { name: "buy_budget", type: "number", required: false, description: "Additional quote budget." },
      { name: "sell_budget", type: "number", required: false, description: "Additional base budget." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Deposit 100 USDC into Carbon strategy 1234."],
  },
  {
    name: "execute_carbon_withdraw_budget",
    slug: "execute-carbon-withdraw-budget",
    title: "Execute Carbon Withdraw Budget",
    summary: "Broadcast withdrawal from strategy",
    description:
      "Withdraw funds from a Carbon strategy on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally. Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
      { name: "buy_budget", type: "number", required: false, description: "Quote amount to withdraw." },
      { name: "sell_budget", type: "number", required: false, description: "Base amount to withdraw." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Withdraw 50 USDC from Carbon strategy 1234."],
  },
  {
    name: "execute_carbon_pause_strategy",
    slug: "execute-carbon-pause-strategy",
    title: "Execute Carbon Pause Strategy",
    summary: "Broadcast strategy pause",
    description:
      "Pause a Carbon strategy on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally. Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Pause Carbon strategy 1234."],
  },
  {
    name: "execute_carbon_resume_strategy",
    slug: "execute-carbon-resume-strategy",
    title: "Execute Carbon Resume Strategy",
    summary: "Broadcast strategy resume",
    description:
      "Resume a paused Carbon strategy on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally. Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Resume Carbon strategy 1234."],
  },
  {
    name: "execute_carbon_delete_strategy",
    slug: "execute-carbon-delete-strategy",
    title: "Execute Carbon Delete Strategy",
    summary: "Broadcast strategy close",
    description:
      "Permanently close a Carbon strategy on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally. Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "strategy_id", type: "string", required: true, description: "Strategy NFT id." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Close Carbon strategy 1234 and withdraw funds."],
  },
  {
    name: "execute_carbon_trade",
    slug: "execute-carbon-trade",
    title: "Execute Carbon Trade",
    summary: "Broadcast taker swap",
    description:
      "Build and broadcast a taker swap against Carbon liquidity on Celo. Requires CELO_PRIVATE_KEY in MCP server env. Signs and broadcasts locally (ERC-20 approve + Carbon tx when needed). Local stdio only.",
    kind: "write",
    availability: "stdio",
    category: "Carbon DeFi",
    inputs: [
      { name: "wallet_address", type: "0x… address", required: true, description: "Must match the configured MCP wallet." },
      { name: "token_in", type: "symbol or 0x…", required: true, description: "Input token." },
      { name: "token_out", type: "symbol or 0x…", required: true, description: "Output token." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount of tokenIn." },
      { name: "slippage_tolerance", type: "number (0-20)", required: false, description: "Max slippage in percent. Defaults to 0.5." },
    ],
    returns: "{ txHash, activityDeepLink, warnings }",
    examples: ["Swap 100 USDC to USDT against Carbon liquidity."],
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

/** Hosted endpoint exposes 72 tools; full stdio catalog includes server-key writes. */
export const HOSTED_TOOL_COUNT = 72;

export function getToolAvailability(tool: ToolDoc): ToolAvailability {
  if (tool.availability) return tool.availability;
  if (tool.kind === "write") return "stdio";
  if (tool.kind === "prepare") return "both";
  return "both";
}

export function availabilityLabel(availability: ToolAvailability): string {
  switch (availability) {
    case "both":
      return "Hosted · Stdio";
    case "hosted":
      return "Hosted only";
    case "stdio":
      return "Stdio only";
  }
}