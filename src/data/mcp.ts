import { HOSTED_TOOL_COUNT, TOOLS } from "@/data/tools";

export const MCP_NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp";
export const MCP_GITHUB_URL = "https://github.com/andrewkimjoseph/celina-mcp";
export const HOSTED_MCP_URL = "https://mcp.usecelina.xyz/api/mcp";
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
