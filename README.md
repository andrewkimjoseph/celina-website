# Celina — Celo MCP Server

**Celina** is an open-source [Model Context Protocol](https://modelcontextprotocol.io) server that gives LLMs read + write access to **Celo mainnet** — balances, stablecoins, sends, swaps, and chain reads.

- Website: [celina.andrewkimjoseph.com](https://celina.andrewkimjoseph.com)
- npm: [@andrewkimjoseph/celina](https://www.npmjs.com/package/@andrewkimjoseph/celina)
- Hosted endpoint: `https://mcp.celina.andrewkimjoseph.com/mcp`

This repo is the **marketing site** for Celina. The MCP server itself is published as the npm package above.

## Site

- **Landing page** (`/`) — overview, install instructions, and tool highlights
- **Tools catalog** (`/tools`) — browse all MCP tools by category
  - Category pages: `/tools/blockchain`, `/tools/account`, `/tools/token`, `/tools/transaction`, `/tools/mento-fx`, `/tools/aave`, `/tools/gooddollar`, `/tools/self`
  - Individual tool docs: `/tools/:category/:toolSlug`
- **Stats dashboard** (`/stats`) — live on-chain activity and npm download metrics

## Stack

- TanStack Start v1 (React 19, Vite 7)
- Tailwind CSS v4 (design tokens in `src/styles.css`)
- Cloudflare Workers (via `@cloudflare/vite-plugin`)
- TanStack Query for data fetching
- Zustand for client state

## Project structure

```
src/
  routes/           # TanStack file-based routes
    index.tsx       # Landing page
    tools.index.tsx # Tools catalog
    tools.$category.index.tsx    # Category pages
    tools.$category.$toolSlug.tsx # Tool detail pages
    stats.tsx       # Stats layout + sub-nav
    stats.index.tsx # Stats overview
    stats.onchain.tsx
    stats.package.tsx
  components/       # Reusable UI (SiteHeader, etc.)
  data/tools.ts     # Tool definitions (≈20 tools, 9 categories)
  lib/              # Stores, helpers, server functions
  styles.css        # Tailwind v4 + custom tokens
```

## Develop

```bash
bun install
bun run dev
```

Route files live in `src/routes/`. TanStack Router auto-generates `src/routeTree.gen.ts` — do not edit it manually.

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

### Local stdio via bridge

For stdio-only clients like Claude Desktop (free plan), bridge to the hosted endpoint with `mcp-remote`:

```json
{
  "mcpServers": {
    "celina": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.celina.andrewkimjoseph.com/mcp",
        "--transport",
        "http-only"
      ]
    }
  }
}
```

### Fully local

To run the server fully locally instead, install the npm package directly:

```json
{
  "mcpServers": {
    "celina": {
      "command": "npx",
      "args": ["-y", "@andrewkimjoseph/celina"],
      "env": {
        "CELO_PRIVATE_KEY": "0x...",
        "SELF_AGENT_PRIVATE_KEY": "0x..."
      }
    }
  }
}
```

- `CELO_PRIVATE_KEY` — required for **write** tools (send tokens, swaps, Aave supply/withdraw)
- `SELF_AGENT_PRIVATE_KEY` — required for **Self Agent** registration and verification tools

Never commit private keys.

## License

MIT
