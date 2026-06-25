export type ToolKind = "read" | "write";
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
  category:
    | "Blockchain"
    | "Account"
    | "Token"
    | "Transaction"
    | "Mento FX"
    | "Uniswap"
    | "Wallet"
    | "GoodDollar"
    | "Aave"
    | "Self"
    | "Governance"
    | "Staking"
    | "NFT"
    | "Contract"
    | "AgentKarma";
  inputs: ToolField[];
  /** What the LLM should expect back */
  returns: string;
  /** Optional example natural-language prompts */
  examples?: string[];
}

export type ToolDocOverride = Partial<
  Pick<
    ToolDoc,
    "summary" | "description" | "returns" | "examples" | "inputs" | "availability"
  >
>;
