import { HOSTED_TOOL_COUNT, TOOLS } from "@/data/tools";

export const MCP_NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp";
export const MCP_GITHUB_URL = "https://github.com/andrewkimjoseph/celina-mcp";
export const HOSTED_MCP_URL = "https://mcp.usecelina.xyz/api/mcp";
export const A2A_AGENT_CARD_URL = "https://usecelina.xyz/.well-known/agent-card.json";
export const A2A_JSONRPC_URL = "https://mcp.usecelina.xyz/api/a2a";
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
export const MCP_INSTALL_CMD = "npm i @andrewkimjoseph/celina-mcp@latest";

export const STDIO_TOOL_COUNT = TOOLS.length;

export { HOSTED_TOOL_COUNT };

export const LOCAL_BRIDGE_CONFIG = `{
  "mcpServers": {
    "celina-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@andrewkimjoseph/celina-mcp"],
      "env": {
        "CELO_PRIVATE_KEY": "0x...",
        "SELF_AGENT_PRIVATE_KEY": "0x..."
      }
    }
  }
}`;

export const HOSTED_CONFIG = `{
  "mcpServers": {
    "celina-mcp": {
      "url": "https://mcp.usecelina.xyz/api/mcp"
    }
  }
}`;

export const MCP_REMOTE_CONFIG = `{
  "mcpServers": {
    "celina-mcp": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.usecelina.xyz/api/mcp"]
    }
  }
}`;
