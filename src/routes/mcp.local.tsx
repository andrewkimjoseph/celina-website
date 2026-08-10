import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTerminal } from "@fortawesome/free-solid-svg-icons";
import { CodeBlock, CopyButton } from "@/components/marketing/code-block";
import {
  LOCAL_BRIDGE_CONFIG,
  MCP_INSTALL_CMD,
} from "@/data/mcp";

export const Route = createFileRoute("/mcp/local")({
  head: () => ({
    meta: [
      { title: "Celina MCP — local stdio install" },
      {
        name: "description",
        content:
          "Install Celina MCP globally and connect via stdio — celina-mcp config for Cursor, Claude Desktop, and full execute/write with CELO_PRIVATE_KEY.",
      },
      { property: "og:title", content: "Celina MCP — local stdio install" },
      {
        property: "og:description",
        content:
          "Install Celina MCP globally and connect via stdio — celina-mcp config for Cursor, Claude Desktop, and full execute/write with CELO_PRIVATE_KEY.",
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
          Install Celina globally, then point your MCP client at the{" "}
          <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">celina-mcp</span> command.
          Works in any stdio client (Cursor, Claude Desktop, LM Studio, Continue, MCP Inspector). Requires{" "}
          <span className="font-semibold text-foreground">Node.js ≥ 20</span>.
        </p>
        <ol className="mt-4 space-y-2 text-sm text-foreground/80">
          <li>
            <span className="font-semibold text-foreground">01.</span> Install globally:
            <div className="mt-2 flex max-w-full items-center gap-2 overflow-hidden rounded-xl border border-[var(--celo-deep)]/40 bg-[var(--celo-ink)] py-2 pl-4 pr-2 text-[12px] text-[var(--celo-cream)] sm:text-sm">
              <span className="font-mono text-[var(--celo-yellow)]">$</span>
              <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono">{MCP_INSTALL_CMD}</code>
              <CopyButton text={MCP_INSTALL_CMD} />
            </div>
          </li>
          <li>
            <span className="font-semibold text-foreground">02.</span> Add to your MCP client:
            <div className="mt-2">
              <CodeBlock code={LOCAL_BRIDGE_CONFIG} />
            </div>
          </li>
          <li>
            <span className="font-semibold text-foreground">03.</span> Restart your MCP client.
          </li>
          <li>
            <span className="font-semibold text-foreground">04.</span> Confirm Celina is connected.
          </li>
        </ol>
      </article>

      <p className="mt-6 text-sm text-muted-foreground">
        Need reads only without Node? See{" "}
        <Link
          to="/mcp/remote"
          className="font-medium text-foreground underline decoration-[var(--celo-yellow)] underline-offset-4"
        >
          remote hosted MCP
        </Link>
        . Browse the full tool catalog on{" "}
        <Link
          to="/tools"
          className="font-medium text-foreground underline decoration-[var(--celo-yellow)] underline-offset-4"
        >
          /tools
        </Link>
        .
      </p>
    </section>
  );
}
