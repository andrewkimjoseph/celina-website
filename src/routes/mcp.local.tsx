import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTerminal } from "@fortawesome/free-solid-svg-icons";
import { CodeBlock, CopyButton } from "@/components/marketing/code-block";
import {
  LOCAL_BRIDGE_CONFIG_MAC,
  LOCAL_BRIDGE_CONFIG_WINDOWS,
  MCP_INSTALL_CMD,
  RESOLVE_CELINA_MCP_CMD,
} from "@/data/mcp";

export const Route = createFileRoute("/mcp/local")({
  head: () => ({
    meta: [
      { title: "Celina MCP — local stdio install" },
      {
        name: "description",
        content:
          "Install Celina MCP globally and connect via stdio — absolute path from which, where, or Get-Command for Cursor, Claude Desktop, and full execute/write with CELO_PRIVATE_KEY.",
      },
      { property: "og:title", content: "Celina MCP — local stdio install" },
      {
        property: "og:description",
        content:
          "Install Celina MCP globally and connect via stdio — absolute path from which, where, or Get-Command for Cursor, Claude Desktop, and full execute/write with CELO_PRIVATE_KEY.",
      },
    ],
  }),
  component: McpLocalPage,
});

function ShellCommand({ command, prompt = "$" }: { command: string; prompt?: string }) {
  return (
    <div className="mt-2 flex max-w-full items-center gap-2 overflow-hidden rounded-xl border border-[var(--celo-deep)]/40 bg-[var(--celo-ink)] py-2 pl-4 pr-2 text-[12px] text-[var(--celo-cream)] sm:text-sm">
      <span className="font-mono text-[var(--celo-yellow)]">{prompt}</span>
      <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono">{command}</code>
      <CopyButton text={command} />
    </div>
  );
}

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
          Install Celina globally, then point your MCP client at the absolute path from{" "}
          <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">which</span>,{" "}
          <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">where</span>, or{" "}
          <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">Get-Command</span>.
          GUI clients (Cursor, Claude Desktop) spawn the command with a minimal PATH that often omits nvm, fnm, Homebrew, or npm’s global bin — an absolute{" "}
          <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">command</span> avoids{" "}
          <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">ENOENT</span> reconnects.
          Works in any stdio client. Requires{" "}
          <span className="font-semibold text-foreground">Node.js ≥ 20</span>.
        </p>
        <ol className="mt-4 space-y-2 text-sm text-foreground/80">
          <li>
            <span className="font-semibold text-foreground">01.</span> Install globally:
            <ShellCommand command={MCP_INSTALL_CMD} />
          </li>
          <li>
            <span className="font-semibold text-foreground">02.</span> Copy the binary path:
            <p className="mt-2 text-xs text-muted-foreground">macOS / Linux</p>
            <ShellCommand command={RESOLVE_CELINA_MCP_CMD.unix} />
            <p className="mt-2 text-xs text-muted-foreground">Windows (cmd)</p>
            <ShellCommand command={RESOLVE_CELINA_MCP_CMD.windowsCmd} prompt=">" />
            <p className="mt-2 text-xs text-muted-foreground">Windows (PowerShell)</p>
            <ShellCommand command={RESOLVE_CELINA_MCP_CMD.windowsPowerShell} prompt="PS>" />
          </li>
          <li>
            <span className="font-semibold text-foreground">03.</span> Add to your MCP client — replace the example{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">command</span> with your path:
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">macOS / Linux</p>
            <div className="mt-2">
              <CodeBlock code={LOCAL_BRIDGE_CONFIG_MAC} />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Windows</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Use the <span className="font-mono">.cmd</span> shim path from{" "}
              <span className="font-mono">where</span> / <span className="font-mono">Get-Command</span>.
            </p>
            <div className="mt-2">
              <CodeBlock code={LOCAL_BRIDGE_CONFIG_WINDOWS} />
            </div>
          </li>
          <li>
            <span className="font-semibold text-foreground">04.</span> Restart your MCP client.
          </li>
          <li>
            <span className="font-semibold text-foreground">05.</span> Confirm Celina is connected.
          </li>
        </ol>
        <p className="mt-5 text-sm text-muted-foreground">
          If logs show{" "}
          <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">spawn celina-mcp ENOENT</span>, path lookup was skipped or the path is stale after a Node/nvm upgrade or npm global prefix change on Windows.
        </p>
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
