# Celina — Celo MCP Server

**Celina** is an open-source [Model Context Protocol](https://modelcontextprotocol.io) server that gives LLMs read + write access to **Celo mainnet** — balances, stablecoins, sends, and chain reads.

- Website: [celina.andrewkimjoseph.com](https://celina.andrewkimjoseph.com)
- npm: [@andrewkimjoseph/celina](https://www.npmjs.com/package/@andrewkimjoseph/celina)
- Hosted endpoint: `https://mcp.celina.andrewkimjoseph.com/mcp`

This repo is the marketing site for Celina. The server itself lives in the [Celina MCP repo](https://www.npmjs.com/package/@andrewkimjoseph/celina).

## Stack

- TanStack Start v1 (React 19, Vite 7)
- Tailwind CSS v4 (tokens in `src/styles.css`)
- Cloudflare Workers via Wrangler

## Develop

```bash
bun install
bun run dev
```

Route files live in `src/routes/`. The landing page is `src/routes/index.tsx`.

## Connect Celina to your agent

### Remote (recommended)

```json
{
  "mcpServers": {
    "celina": {
      "type": "streamable-http",
      "url": "https://mcp.celina.andrewkimjoseph.com/mcp"
    }
  }
}
```

### Local stdio

```json
{
  "mcpServers": {
    "celina": {
      "command": "npx",
      "args": ["-y", "@andrewkimjoseph/celina"]
    }
  }
}
```

For local write tools, add `"env": { "CELO_PRIVATE_KEY": "0x..." }` — never commit the key.

## License

MIT