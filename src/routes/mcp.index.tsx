import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCloud,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faNpm } from "@fortawesome/free-brands-svg-icons";
import {
  HOSTED_TOOL_COUNT,
  MCP_GITHUB_URL,
  MCP_NPM_URL,
  STDIO_TOOL_COUNT,
} from "@/data/mcp";

export const Route = createFileRoute("/mcp/")({
  head: () => ({
    meta: [
      { title: "Celina MCP — overview" },
      {
        name: "description",
        content:
          "Overview of Celina MCP — local stdio for full Celo execution vs remote hosted reads and prepare.",
      },
    ],
  }),
  component: McpOverviewPage,
});

function McpOverviewPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">@andrewkimjoseph/celina-mcp</span> is the MCP server
          that registers the shared Celina SDK tool catalog for LLM clients. Your agent calls typed tools for
          balances, swaps, DeFi protocols, and governance — not raw RPC.
        </p>
        <p>
          Pick a deployment mode: <strong className="text-foreground">local stdio</strong> for the full catalog
          with execute/write when you set <code className="rounded bg-secondary px-1 py-0.5 text-sm">CELO_PRIVATE_KEY</code>,
          or <strong className="text-foreground">remote hosted</strong> for instant reads and unsigned prepare flows without installing Node.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-foreground/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/10 bg-muted/40 text-left">
              <th className="px-4 py-3 font-semibold text-foreground" />
              <th className="px-4 py-3 font-semibold text-foreground">
                <FontAwesomeIcon icon={faTerminal} className="mr-1.5 h-3.5 w-3.5" />
                Local stdio
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">
                <FontAwesomeIcon icon={faCloud} className="mr-1.5 h-3.5 w-3.5" />
                Remote hosted
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {[
              ["Tools", `${STDIO_TOOL_COUNT} full catalog`, `${HOSTED_TOOL_COUNT} reads + prepare`],
              ["Install", "Node.js ≥ 20, npx", "None — URL only"],
              ["Private keys", "Your machine (optional)", "Never — no server keys"],
              ["Writes", "send_token, execute_*, Aave, UBI", "Not available"],
              ["Self Agent ID", "Full lifecycle", "Verify/lookup only"],
            ].map(([label, local, remote]) => (
              <tr key={label}>
                <td className="px-4 py-3 font-medium text-foreground">{label}</td>
                <td className="px-4 py-3 text-muted-foreground">{local}</td>
                <td className="px-4 py-3 text-muted-foreground">{remote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          to="/mcp/local"
          className="group flex flex-col rounded-2xl border border-foreground/10 bg-card p-6 shadow-[var(--shadow-soft)] transition hover:border-[var(--celo-yellow)]/60"
        >
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
            <FontAwesomeIcon icon={faTerminal} className="h-4 w-4" />
          </div>
          <h2
            className="mt-4 text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Local stdio
          </h2>
          <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
            Recommended. Full tool catalog with execute/write when you set CELO_PRIVATE_KEY.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:underline">
            Install guide <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </span>
        </Link>

        <Link
          to="/mcp/remote"
          className="group flex flex-col rounded-2xl border border-foreground/10 bg-card p-6 shadow-[var(--shadow-soft)] transition hover:border-[var(--celo-yellow)]/60"
        >
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
            <FontAwesomeIcon icon={faCloud} className="h-4 w-4" />
          </div>
          <h2
            className="mt-4 text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Remote hosted
          </h2>
          <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
            Streamable HTTP at mcp.usecelina.xyz — reads and unsigned prepares.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:underline">
            Connect remotely <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
          </span>
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
        >
          Browse tool catalog
        </Link>
        <a
          href={MCP_NPM_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
        >
          <FontAwesomeIcon icon={faNpm} className="h-3.5 w-3.5" /> npm
        </a>
        <a
          href={MCP_GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
        >
          <FontAwesomeIcon icon={faGithub} className="h-3.5 w-3.5" /> GitHub
        </a>
      </div>
    </section>
  );
}
