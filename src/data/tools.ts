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
  category: "Blockchain" | "Account" | "Token" | "Transaction" | "Mento FX" | "Wallet" | "GoodDollar" | "Aave";
  inputs: ToolField[];
  /** What the LLM should expect back */
  returns: string;
  /** Optional example natural-language prompts */
  examples?: string[];
  /** True if write tools need an encrypted key */
  requiresEncryptedKey?: boolean;
}

const ENC_KEY: ToolField = {
  name: "encryptedPrivateKey",
  type: "string",
  required: false,
  description:
    "RSA-OAEP encrypted private key (base64). Encrypt locally with get_wallet_encryption_public_key. Omit if running locally with CELO_PRIVATE_KEY set.",
};

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
    requiresEncryptedKey: true,
    inputs: [
      { name: "to", type: "0x… address", required: true, description: "Recipient." },
      { name: "token", type: "symbol or 0x…", required: false, description: "Token to send. Defaults to CELO." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount, e.g. '1.5'." },
      ENC_KEY,
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
      "Send CELO or an ERC-20 token on Celo mainnet. The caller must encrypt their private key with the server's RSA public key (from get_wallet_encryption_public_key) before invoking — or set CELO_PRIVATE_KEY locally.",
    kind: "write",
    category: "Transaction",
    requiresEncryptedKey: true,
    inputs: [
      { name: "to", type: "0x… address", required: true, description: "Recipient." },
      { name: "token", type: "symbol or 0x…", required: false, description: "Token to send. Defaults to CELO." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount, e.g. '0.01'." },
      ENC_KEY,
    ],
    returns: "{ hash, status, blockNumber }",
    examples: ["Send 0.5 USDm to 0x…"],
  },
  {
    name: "get_wallet_encryption_public_key",
    slug: "get-wallet-encryption-public-key",
    title: "Get Wallet Encryption Public Key",
    summary: "Server's RSA public key for write ops",
    description:
      "Returns the server's RSA public key so the client can encrypt a private key before passing it to any write tool. In local stdio mode this is unused — set CELO_PRIVATE_KEY instead.",
    kind: "read",
    category: "Wallet",
    inputs: [],
    returns: "{ algorithm, publicKey (PEM) }",
    examples: ["Give me the public key so I can encrypt my wallet."],
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
    requiresEncryptedKey: true,
    inputs: [
      { name: "tokenIn", type: "symbol or 0x…", required: true, description: "Input token." },
      { name: "tokenOut", type: "symbol or 0x…", required: true, description: "Output token." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount of tokenIn." },
      { name: "recipient", type: "0x… address", required: false, description: "Address that receives output tokens. Defaults to the signer." },
      { name: "slippageTolerance", type: "number (0-20)", required: false, description: "Max slippage in percent. Defaults to 0.5." },
      { name: "deadlineMinutes", type: "integer", required: false, description: "Transaction deadline in minutes. Defaults to 5." },
      ENC_KEY,
    ],
    returns: "{ approvalGas?, swapGas, totalGas, estimatedCostWei }",
  },
  {
    name: "execute_mento_fx",
    slug: "execute-mento-fx",
    title: "Execute Mento FX",
    summary: "Send approval + Mento FX swap on mainnet",
    description:
      "Execute a Mento FX conversion on mainnet (e.g. USDm → EURm via Mento oracle pools). Sends the ERC-20 approval first if needed, then the FX trade. The caller must encrypt their private key with get_wallet_encryption_public_key before calling — or set CELO_PRIVATE_KEY locally.",
    kind: "write",
    category: "Mento FX",
    requiresEncryptedKey: true,
    inputs: [
      { name: "tokenIn", type: "symbol or 0x…", required: true, description: "Input token." },
      { name: "tokenOut", type: "symbol or 0x…", required: true, description: "Output token." },
      { name: "amount", type: "string", required: true, description: "Human-readable amount of tokenIn." },
      { name: "recipient", type: "0x… address", required: false, description: "Address that receives output tokens. Defaults to the signer." },
      { name: "slippageTolerance", type: "number (0-20)", required: false, description: "Max slippage in percent. Defaults to 0.5." },
      { name: "deadlineMinutes", type: "integer", required: false, description: "Transaction deadline in minutes. Defaults to 5." },
      ENC_KEY,
    ],
    returns: "{ approvalHash?, swapHash, status, blockNumber }",
    examples: ["Convert 100 USDm to EURm."],
  },
  {
    name: "supply_aave_usdt",
    slug: "supply-aave-usdt",
    title: "Supply Aave USDT",
    summary: "Lend USDT to Aave V3 for aUSDT",
    description:
      "Supply (lend) USDT to Aave V3 on Celo mainnet. Deposits USDT and receives aUSDT interest-bearing tokens. Sends an ERC-20 approval first if needed. The caller must encrypt their private key with get_wallet_encryption_public_key before calling — or set CELO_PRIVATE_KEY locally.",
    kind: "write",
    category: "Aave",
    requiresEncryptedKey: true,
    inputs: [
      { name: "amount", type: "string", required: true, description: "Human-readable USDT amount, e.g. '100'." },
      ENC_KEY,
    ],
    returns: "{ approvalHash?, supplyHash, status, blockNumber }",
    examples: ["Lend 100 USDT to Aave on Celo."],
  },
  {
    name: "withdraw_aave_usdt",
    slug: "withdraw-aave-usdt",
    title: "Withdraw Aave USDT",
    summary: "Redeem aUSDT back to USDT",
    description:
      "Withdraw USDT from Aave V3 on Celo mainnet by redeeming aUSDT. Pass an explicit amount or set withdrawMax to pull the full supplied balance. The caller must encrypt their private key with get_wallet_encryption_public_key before calling — or set CELO_PRIVATE_KEY locally.",
    kind: "write",
    category: "Aave",
    requiresEncryptedKey: true,
    inputs: [
      { name: "amount", type: "string", required: false, description: "Human-readable USDT amount, e.g. '100'. Omit when withdrawMax is true." },
      { name: "withdrawMax", type: "boolean", required: false, description: "Withdraw the full supplied USDT balance from Aave." },
      ENC_KEY,
    ],
    returns: "{ hash, status, blockNumber, amountWithdrawn }",
    examples: ["Withdraw all my USDT from Aave."],
  },
];

export const TOOL_BY_SLUG: Record<string, ToolDoc> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t]),
);