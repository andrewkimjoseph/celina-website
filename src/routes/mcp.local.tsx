import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTerminal } from "@fortawesome/free-solid-svg-icons";
import { CodeBlock } from "@/components/marketing/code-block";
import {
  LOCAL_BRIDGE_CONFIG,
  LOCAL_BRIDGE_CONFIG_NODE,
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
            <span className="font-semibold text-foreground">01.</span> Install globally:{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">{MCP_INSTALL_CMD}</span>
          </li>
          <li>
            <span className="font-semibold text-foreground">02.</span> Open your MCP config and merge the snippet below
            into <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">mcpServers</span>. Claude
            Desktop:{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">
              claude_desktop_config.json
            </span>{" "}
            (macOS{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">
              ~/Library/Application Support/Claude/
            </span>
            ; Windows{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">%APPDATA%\Claude\</span>; Linux{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">~/.config/Claude/</span>). Cursor:{" "}
            <em>Settings → MCP</em>.
          </li>
          <li>
            <span className="font-semibold text-foreground">03.</span> Fully quit and restart the client (closing the
            window is not enough on Claude Desktop)
          </li>
          <li>
            <span className="font-semibold text-foreground">04.</span> Verify MCP shows connected; ask{" "}
            <em>What is my wallet address?</em>
          </li>
        </ol>
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium text-foreground">Primary config</p>
          <CodeBlock code={LOCAL_BRIDGE_CONFIG} />
        </div>
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium text-foreground">
            If <code className="rounded bg-secondary px-1 py-0.5">celina-mcp</code> is not found — use{" "}
            <code className="rounded bg-secondary px-1 py-0.5">npm root -g</code> to find your global modules path
          </p>
          <CodeBlock code={LOCAL_BRIDGE_CONFIG_NODE} />
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
          reads and writes, or call <code className="rounded bg-secondary px-1 py-0.5">get_wallet_address</code> when
          you need the signer as data.
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-foreground/10">
          <table className="w-full min-w-[28rem] text-left text-xs">
            <thead>
              <tr className="border-b border-foreground/10 bg-muted/40">
                <th className="px-3 py-2 font-semibold text-foreground">Symptom</th>
                <th className="px-3 py-2 font-semibold text-foreground">What to do</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-foreground/5">
                <td className="px-3 py-2 align-top">celina-mcp not found</td>
                <td className="px-3 py-2 align-top">Node fallback config above; path from npm root -g</td>
              </tr>
              <tr>
                <td className="px-3 py-2 align-top">Cannot find package ox</td>
                <td className="px-3 py-2 align-top">Upgrade package or npm i -g ox; fully restart client</td>
              </tr>
            </tbody>
          </table>
        </div>
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
