<p align="center">
  <img src="./assets/celina-banner.png" alt="Celina — Give your LLM a wallet on Celo">
</p>

# Celina — marketing site

**Celina** is an open-source agent stack for **Celo mainnet** — one shared tool catalog from [`@andrewkimjoseph/celina-sdk/tools`](https://www.npmjs.com/package/@andrewkimjoseph/celina-sdk) that powers MCP clients, the hosted endpoint, and browser wallet apps.

- Website: [usecelina.xyz](https://usecelina.xyz)
- SDK: [@andrewkimjoseph/celina-sdk](https://www.npmjs.com/package/@andrewkimjoseph/celina-sdk) — reads, prepares, and the shared LLM tool catalog
- MCP: [@andrewkimjoseph/celina-mcp](https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp) — registers the catalog for IDE / CLI agents
- Hosted endpoint: `https://mcp.usecelina.xyz/api/mcp` — **75 tools** (reads + GoodDollar reserve estimate + Carbon prepare; no server-key writes)
- Full stdio catalog: **88 tools** (adds `execute_carbon_*`, `execute_gooddollar_reserve_swap`, and other server-key execute/write paths)

This repo is the **marketing site** for Celina. The SDK and MCP packages live in sibling directories in the monorepo.

## Site

- **Landing page** (`/`) — overview, install instructions, and tool highlights
- **SDK page** (`/sdk`) — shared tool catalog, programmatic client, and integration paths
- **Tools catalog** (`/tools`) — browse all MCP tools by category
  - Category pages: `/tools/blockchain`, `/tools/carbon-defi`, `/tools/mento-fx`, `/tools/uniswap`, `/tools/aave`, `/tools/gooddollar` (UBI + reserve quote), `/tools/self`, and more
  - Individual tool docs: `/tools/:category/:toolSlug`
- **Stats dashboard** (`/stats`) — on-chain activity (Dune), off-chain MCP tool calls and unique wallets (Amplitude → Supabase), and npm downloads

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
    sdk.tsx         # SDK + tool catalog page
    tools.index.tsx # Tools catalog
    tools.$category.index.tsx    # Category pages
    tools.$category.$toolSlug.tsx # Tool detail pages
    stats.tsx       # Stats layout + sub-nav
    stats.index.tsx # Stats overview
    stats.onchain.tsx
    stats.offchain.tsx
    stats.package.tsx
  components/       # Reusable UI (SiteHeader, etc.)
  data/tools.ts     # Tool definitions (88 stdio tools, 75 hosted)
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

### Local stdio (recommended)

Full catalog with execute/write when you set `CELO_PRIVATE_KEY`. Keys stay on your machine.

```json
{
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
}
```

### Hosted (reads + prepare)

No install, no keys — chain reads and unsigned `prepare_carbon_*` flows:

```json
{
  "mcpServers": {
    "celina-mcp": {
      "url": "https://mcp.usecelina.xyz/api/mcp"
    }
  }
}
```

Never send private keys to the hosted endpoint. Self registration sessions are unreliable on serverless — use local stdio for Self Agent ID lifecycle flows.

### Local stdio via bridge

For stdio-only clients that cannot use Streamable HTTP directly, bridge to the hosted endpoint with `mcp-remote`:

```json
{
  "mcpServers": {
    "celina": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.usecelina.xyz/api/mcp",
        "--transport",
        "http-only"
      ]
    }
  }
}
```

- `CELO_PRIVATE_KEY` — required for **write** tools (send tokens, swaps, Aave supply/withdraw, `execute_carbon_*`). On local stdio, many reads accept an omitted `address` / `wallet_address` and default to this signer; use **`get_wallet_address`** when the agent needs the address as data.
- `SELF_AGENT_PRIVATE_KEY` — required for **Self Agent** registration and verification tools

Never commit private keys.

### Browser wallet apps

Apps that use **`surface: "browser"`** from `@andrewkimjoseph/celina-sdk/tools` pass the connected wallet on every call — no MCP server, no server keys. See the SDK page (`/sdk`) and [tool catalog guide](https://andrewkimjoseph.gitbook.io/celina-sdk/guides/tool-catalog).

## License

MIT
