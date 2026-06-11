import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTerminal } from "@fortawesome/free-solid-svg-icons";
import { CodeBlock } from "@/components/marketing/code-block";
import { LOCAL_BRIDGE_CONFIG, MCP_INSTALL_CMD } from "@/data/mcp";

export const Route = createFileRoute("/mcp/local")({
  head: () => ({
    meta: [
      { title: "Celina MCP — local stdio install" },
      {
        name: "description",
        content:
          "Install Celina MCP locally via stdio — npx config for Cursor, Claude Desktop, and full execute/write with CELO_PRIVATE_KEY.",
      },
      { property: "og:title", content: "Celina MCP — local stdio install" },
      {
        property: "og:description",
        content:
          "Install Celina MCP locally via stdio — npx config for Cursor, Claude Desktop, and full execute/write with CELO_PRIVATE_KEY.",
      },
    ],
  }),
  component: McpLocalPage,
});

function McpLocalPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <article className="min-w-0 overflow-hidden rounded-2xl border border-foreground/15 bg-card p-7 shadow-[var(--shadow-soft)]">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--celo-forest)]">
          <FontAwesomeIcon icon={faTerminal} className="h-3.5 w-3.5" /> Local stdio
          <span className="rounded-full bg-[var(--celo-forest)] px-2 py-0.5 text-[10px] tracking-[0.18em] text-[var(--celo-cream)] dark:text-[var(--celo-ink)]">
            Recommended
          </span>
        </div>
        <h2
          className="text-2xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Run it locally with Node
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your client spawns <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">npx</span> and
          talks to Celina over stdio. Works in any stdio client (Cursor, Claude Desktop, LM Studio, Continue, MCP
          Inspector). Requires Node.js{" "}
          <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">≥ 20</span>.
        </p>
        <ol className="mt-4 space-y-2 text-sm text-foreground/80">
          <li>
            <span className="font-semibold text-foreground">01.</span> Run{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">{MCP_INSTALL_CMD}</span>
          </li>
          <li>
            <span className="font-semibold text-foreground">02.</span> Open your MCP config (e.g.{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">claude_desktop_config.json</span>,
            Cursor <em>Settings → MCP</em>) and merge the snippet below into{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">mcpServers</span>
          </li>
          <li>
            <span className="font-semibold text-foreground">03.</span> Restart the client
          </li>
        </ol>
        <div className="mt-5">
          <CodeBlock code={LOCAL_BRIDGE_CONFIG} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Keep <code className="rounded bg-secondary px-1 py-0.5">CELO_PRIVATE_KEY</code> and{" "}
          <code className="rounded bg-secondary px-1 py-0.5">SELF_AGENT_PRIVATE_KEY</code> out of source control —
          they stay on your machine.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          With <code className="rounded bg-secondary px-1 py-0.5">CELO_PRIVATE_KEY</code>, omit{" "}
          <code className="rounded bg-secondary px-1 py-0.5">address</code> /{" "}
          <code className="rounded bg-secondary px-1 py-0.5">wallet_address</code> on wallet-scoped tools for “my”
          reads and Carbon prepare, or call <code className="rounded bg-secondary px-1 py-0.5">get_wallet_address</code>{" "}
          when you need the signer as data.
        </p>
      </article>

      <p className="mt-6 text-sm text-muted-foreground">
        Need reads only without Node? See{" "}
        <Link to="/mcp/remote" className="font-medium text-foreground underline decoration-[var(--celo-yellow)] underline-offset-4">
          remote hosted MCP
        </Link>
        . Browse the full tool catalog on{" "}
        <Link to="/tools" className="font-medium text-foreground underline decoration-[var(--celo-yellow)] underline-offset-4">
          /tools
        </Link>
        .
      </p>
    </section>
  );
}
