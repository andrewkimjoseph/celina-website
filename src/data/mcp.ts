import {
  HOSTED_MCP_TOOL_NAMES_CSV,
  HOSTED_TOOL_COUNT,
  STDIO_MCP_TOOL_NAMES_CSV,
  TOOLS,
} from "@/data/tools";

export const MCP_NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp";
export const MCP_GITHUB_URL = "https://github.com/andrewkimjoseph/celina-mcp";
export const MCP_REMOTE_GITHUB_URL = "https://github.com/andrewkimjoseph/celina-mcp-remote";
export const HOSTED_MCP_URL = "https://mcp.usecelina.xyz/mcp";
export const CELO_DOCS_URL =
  "https://docs.celo.org/build-on-celo/build-with-ai/mcp/celina";
export const A2A_AGENT_CARD_URL = "https://usecelina.xyz/.well-known/agent-card.json";
export const A2A_JSONRPC_URL = "https://mcp.usecelina.xyz/a2a";
export const OASF_MANIFEST_URL = "https://usecelina.xyz/.well-known/oasf.json";
export const AGENT_JSON_URL = "https://usecelina.xyz/agent.json";
export const OASF_REPO_URL = "https://github.com/agntcy/oasf/";
export const CELINA_TOOL_MIME = "application/vnd.celina.tool+json";

/** OASF v0.8.0 skill slugs for ERC-8004 registry forms */
export const OASF_SKILLS_CSV =
  "natural_language_processing/information_retrieval_synthesis/information_retrieval_synthesis_search, natural_language_processing/information_retrieval_synthesis/fact_extraction, natural_language_processing/analytical_reasoning/fact_verification, tool_interaction/api_schema_understanding, tool_interaction/tool_use_planning, governance_compliance/compliance_assessment";

/** OASF v0.8.0 domain slugs for ERC-8004 registry forms */
export const OASF_DOMAINS_CSV =
  "technology/blockchain, technology/blockchain/cryptocurrency, technology/blockchain/defi, technology/blockchain/smart_contracts, finance_and_business/investment_services";
export const MCP_INSTALL_CMD = "npm i -g @andrewkimjoseph/celina-mcp@latest";
export const RESOLVE_CELINA_MCP_CMD = {
  unix: "which celina-mcp",
  windowsCmd: "where celina-mcp",
  windowsPowerShell: "(Get-Command celina-mcp).Source",
} as const;

export const STDIO_TOOL_COUNT = TOOLS.length;

export { HOSTED_MCP_TOOL_NAMES_CSV, HOSTED_TOOL_COUNT, STDIO_MCP_TOOL_NAMES_CSV };

export const LOCAL_BRIDGE_CONFIG_MAC = `{
  "mcpServers": {
    "celina-mcp": {
      "type": "stdio",
      "command": "/Users/YourName/.nvm/versions/node/v24.15.0/bin/celina-mcp",
      "args": [],
      "env": {
        "CELO_PRIVATE_KEY": "0x...",
        "SELF_AGENT_PRIVATE_KEY": "0x..."
      }
    }
  }
}`;

export const LOCAL_BRIDGE_CONFIG_WINDOWS = `{
  "mcpServers": {
    "celina-mcp": {
      "type": "stdio",
      "command": "C:\\\\Users\\\\YourName\\\\AppData\\\\Roaming\\\\npm\\\\celina-mcp.cmd",
      "args": [],
      "env": {
        "CELO_PRIVATE_KEY": "0x...",
        "SELF_AGENT_PRIVATE_KEY": "0x..."
      }
    }
  }
}`;

/** @deprecated Use LOCAL_BRIDGE_CONFIG_MAC or LOCAL_BRIDGE_CONFIG_WINDOWS */
export const LOCAL_BRIDGE_CONFIG = LOCAL_BRIDGE_CONFIG_MAC;

export const HOSTED_CONFIG = `{
  "mcpServers": {
    "celina-mcp": {
      "url": "https://mcp.usecelina.xyz/mcp"
    }
  }
}`;

export const MCP_REMOTE_CONFIG = `{
  "mcpServers": {
    "celina-mcp": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.usecelina.xyz/mcp"]
    }
  }
}`;
