import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faLock } from "@fortawesome/free-solid-svg-icons";
import { CodeBlock } from "@/components/marketing/code-block";
import { HOSTED_CONFIG, HOSTED_MCP_URL, HOSTED_TOOL_COUNT, MCP_REMOTE_CONFIG } from "@/data/mcp";

export const Route = createFileRoute("/mcp/remote")({
  head: () => ({
    meta: [
      { title: "Celina MCP — remote hosted endpoint" },
      {
        name: "description",
        content:
          "Connect to Celina remote MCP at mcp.usecelina.xyz — Streamable HTTP for reads and prepare without a local install.",
      },
      { property: "og:title", content: "Celina MCP — remote hosted endpoint" },
      {
        property: "og:description",
        content:
          "Connect to Celina remote MCP at mcp.usecelina.xyz — Streamable HTTP for reads and prepare without a local install.",
      },
    ],
  }),
  component: McpRemotePage,
});

function McpRemotePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <article className="min-w-0 overflow-hidden rounded-2xl border border-foreground/15 bg-card p-7 shadow-[var(--shadow-soft)]">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--celo-forest)]">
          <FontAwesomeIcon icon={faCloud} className="h-3.5 w-3.5" /> Remote hosted
          <span className="rounded-full border border-[var(--celo-forest)]/40 bg-[var(--celo-forest)]/10 px-2 py-0.5 text-[10px] tracking-[0.18em] text-[var(--celo-forest)] dark:border-[var(--celo-yellow)]/40 dark:bg-[var(--celo-yellow)]/10 dark:text-[var(--celo-yellow)]">
            Reads + prepare
          </span>
        </div>
        <h2
          className="text-2xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Skip the install — point at the hosted endpoint
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No Node, no <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">npx</span>, no keys.
          The hosted endpoint exposes <span className="font-semibold text-foreground">{HOSTED_TOOL_COUNT} tools</span>:
          chain reads (including GoodDollar G$ ↔ USDm reserve quotes), gas estimates, and all{" "}
          unsigned prepare flows for Mento FX, Uniswap, Aave, and GoodDollar.
        </p>

        <div className="mt-5 rounded-xl border border-foreground/10 bg-muted/30 p-4 text-sm">
          <p className="font-medium text-foreground">Endpoint</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground break-all">{HOSTED_MCP_URL}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Alias: <code className="rounded bg-secondary px-1 py-0.5">https://mcp.usecelina.xyz/mcp</code> rewrites to{" "}
            <code className="rounded bg-secondary px-1 py-0.5">/api/mcp</code>
          </p>
        </div>

        <h3 className="mt-8 text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Streamable HTTP clients
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          For clients that support remote MCP URLs directly (Cursor, Claude, etc.):
        </p>
        <div className="mt-4">
          <CodeBlock code={HOSTED_CONFIG} />
        </div>

        <h3 className="mt-8 text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Stdio-only clients (mcp-remote bridge)
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          If your client only supports stdio, use{" "}
          <a
            href="https://www.npmjs.com/package/mcp-remote"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline decoration-[var(--celo-yellow)] underline-offset-4"
          >
            mcp-remote
          </a>{" "}
          to bridge to the hosted endpoint:
        </p>
        <div className="mt-4">
          <CodeBlock code={MCP_REMOTE_CONFIG} />
        </div>
      </article>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-foreground/10 bg-card p-5">
          <p className="text-sm font-semibold text-foreground">Works remotely</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Chain reads and balances</li>
            <li>Gas estimates (with explicit addresses)</li>
            <li>GoodDollar reserve quote / estimate</li>
            <li>Self verify / lookup (read-only)</li>
          </ul>
        </div>
        <div className="rounded-xl border border-foreground/10 bg-card p-5">
          <p className="text-sm font-semibold text-foreground">Requires local stdio</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>
              <code className="rounded bg-secondary px-1 py-0.5 text-xs">send_token</code>
            </li>
            <li>Mento FX, Uniswap v4, Aave execute</li>
            <li>GoodDollar UBI claim, reserve execute</li>
            <li>Self Agent ID registration lifecycle</li>
            <li>Wallet-scoped estimates without a key</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-[var(--celo-yellow)]/30 bg-[var(--celo-yellow)]/5 p-4 text-sm">
        <FontAwesomeIcon icon={faLock} className="mt-0.5 h-4 w-4 shrink-0 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]" />
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Never send private keys to the hosted endpoint.</span>{" "}
          Server-key writes are disabled server-side. Self registration sessions are unreliable on stateless
          serverless — use{" "}
          <Link to="/mcp/local" className="font-medium text-foreground underline decoration-[var(--celo-yellow)] underline-offset-4">
            local stdio
          </Link>{" "}
          for Self Agent ID lifecycle flows.
        </p>
      </div>
    </section>
  );
}
