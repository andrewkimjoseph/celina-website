import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faBolt,
  faCircleNodes,
  faCloud,
  faCodeBranch,
  faLock,
  faShieldHalved,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faNpm } from "@fortawesome/free-brands-svg-icons";
import celoWordmarkYellow from "@/assets/celo-wordmark-yellow.svg";
import { SiteHeader } from "@/components/site-header";
import { HOSTED_TOOL_COUNT, TOOLS } from "@/data/tools";

const SDK_NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-sdk";
const SDK_DOCS_URL = "https://andrewkimjoseph.gitbook.io/celina-sdk";
const SDK_GITHUB_URL = "https://github.com/andrewkimjoseph/celina-sdk";
const MCP_NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp";
const MCP_GITHUB_URL = "https://github.com/andrewkimjoseph/celina-mcp";
const HOSTED_MCP_URL = "https://mcp.usecelina.xyz/api/mcp";
const CELESTE_URL = "https://celeste.usecelina.xyz";
const CELESTE_GITHUB_URL = "https://github.com/andrewkimjoseph/celeste-ai";
const AUTHOR_NPM_URL = "https://www.npmjs.com/~andrewkimjoseph";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Celina — Celo agent stack" },
      {
        name: "description",
        content:
          "What Celina is, how the SDK, MCP server, hosted endpoint, and Celeste AI fit together.",
      },
      { property: "og:title", content: "About Celina — Celo agent stack" },
      {
        property: "og:description",
        content:
          "What Celina is, how the SDK, MCP server, hosted endpoint, and Celeste AI fit together.",
      },
    ],
  }),
  component: AboutPage,
});

function ProductCard({
  icon,
  title,
  subtitle,
  body,
  children,
}: {
  icon: typeof faBolt;
  title: string;
  subtitle: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-foreground/10 bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </div>
      <h3
        className="mt-4 text-lg font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {subtitle}
      </p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ArchNode({
  label,
  detail,
  highlight,
}: {
  label: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-center ${
        highlight
          ? "border-[var(--celo-yellow)]/50 bg-[var(--celo-yellow)]/10"
          : "border-foreground/10 bg-card"
      }`}
    >
      <p className="font-mono text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: "var(--gradient-hero)" }} />
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16">
          <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Celina
            </Link>
            <span>/</span>
            <span className="text-foreground/80">About</span>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-foreground">
            About
          </span>
          <h1
            className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            One agent stack for{" "}
            <span className="text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]">Celo mainnet</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            <span className="font-semibold text-foreground">Celina</span> is an open-source toolkit that gives LLMs
            structured read and write access to Celo — through a single shared tool catalog, not a patchwork of
            one-off RPC calls.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2
          className="text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Mission
        </h2>
        <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Agents need reliable, typed access to balances, swaps, DeFi protocols, and governance — not raw
            contract ABIs scattered across docs. Celina centralizes that in{" "}
            <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">
              @andrewkimjoseph/celina-sdk/tools
            </span>
            : one set of Zod schemas, descriptions, and handlers for every integration surface.
          </p>
          <p>
            The same catalog powers{" "}
            <a
              className="font-medium text-foreground underline decoration-[var(--celo-yellow)] decoration-2 underline-offset-4"
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noreferrer"
            >
              MCP
            </a>{" "}
            clients (Cursor, Claude Desktop), a hosted HTTP endpoint for quick reads, and
            browser wallet apps where users sign in their own wallet. When the SDK adds a tool, every host stays in
            sync.
          </p>
          <p>
            Celina targets <span className="font-medium text-foreground">Celo mainnet</span> today — stablecoins,
            Mento FX, Uniswap v4, Aave V3, GoodDollar, Self Agent ID, and core chain reads. MIT
            licensed and built for builders shipping real on-chain agents.
          </p>
        </div>
      </section>

      {/* Architecture */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="mb-5 flex items-center gap-2">
          <FontAwesomeIcon icon={faCircleNodes} className="h-4 w-4 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]" />
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Architecture
          </h2>
        </div>
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
          Everything flows from the SDK tool catalog. Hosts filter by surface (<span className="font-mono text-xs">mcp</span> vs{" "}
          <span className="font-mono text-xs">browser</span>) and wire signing their own way.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ArchNode
            label="celina-sdk"
            detail="/tools catalog + services"
            highlight
          />
          <ArchNode label="celina-mcp" detail="stdio MCP server" />
          <ArchNode label="mcp.usecelina.xyz" detail="hosted HTTP" />
          <ArchNode label="celeste.usecelina.xyz" detail="browser chat UI" />
        </div>
        <div className="mt-4 flex justify-center">
          <div className="hidden h-8 w-px bg-foreground/15 sm:block" aria-hidden />
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {TOOLS.length} tools in the full stdio catalog · {HOSTED_TOOL_COUNT} on the hosted endpoint
        </p>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2
          className="mb-5 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Products
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ProductCard
            icon={faCodeBranch}
            title="Celina SDK"
            subtitle="Core library"
            body="Programmatic reads, wallet signing flows, and the shared LLM tool catalog. Use directly or filter for your agent host."
          >
            <Link
              to="/sdk"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
            >
              SDK page
            </Link>
            <a
              href={SDK_DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
            >
              Docs <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5" />
            </a>
            <a
              href={SDK_NPM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
            >
              <FontAwesomeIcon icon={faNpm} className="h-3 w-3" /> npm
            </a>
          </ProductCard>

          <ProductCard
            icon={faBolt}
            title="Celina MCP"
            subtitle="Local stdio server"
            body="Registers the full SDK catalog for IDE and CLI agents. Set CELO_PRIVATE_KEY for server-key writes; omit for read-only."
          >
            <a
              href={MCP_NPM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
            >
              <FontAwesomeIcon icon={faNpm} className="h-3 w-3" /> npm
            </a>
            <a
              href={MCP_GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
            >
              <FontAwesomeIcon icon={faGithub} className="h-3 w-3" /> GitHub
            </a>
            <Link
              to="/mcp/local"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
            >
              Install guide
            </Link>
          </ProductCard>

          <ProductCard
            icon={faCloud}
            title="Hosted endpoint"
            subtitle="Streamable HTTP"
            body={`${HOSTED_TOOL_COUNT} tools — chain reads, GoodDollar reserve quotes, and AgentKarma reputation. No install, no server keys.`}
          >
            <a
              href={HOSTED_MCP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
            >
              Endpoint <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5" />
            </a>
          </ProductCard>

          <ProductCard
            icon={faWandMagicSparkles}
            title="Celeste AI"
            subtitle="Reference browser app"
            body="DeFAI chat UI using surface: browser + wagmi. Users sign in their wallet — no MCP server, no CELO_PRIVATE_KEY. Independent of usecelina.xyz."
          >
            <div className="flex flex-wrap gap-2">
              <a
                href={CELESTE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
              >
                Open app <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5" />
              </a>
              <a
                href={CELESTE_GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
              >
                <FontAwesomeIcon icon={faGithub} className="h-3 w-3" /> GitHub
              </a>
            </div>
          </ProductCard>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2
          className="mb-5 text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Principles
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: faShieldHalved,
              title: "MIT licensed",
              body: "Open source. Use, fork, and ship agents without license friction.",
            },
            {
              icon: faCircleNodes,
              title: "One catalog",
              body: "No duplicate tool definitions between MCP, hosted, and browser hosts.",
            },
            {
              icon: faLock,
              title: "Keys stay local",
              body: "The SDK never holds private keys. Writes require the user's wallet or your MCP env — never the hosted endpoint.",
            },
            {
              icon: faBolt,
              title: "Celo mainnet",
              body: "Production registry tokens, live DeFi protocols, and real on-chain state.",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="flex gap-3 rounded-xl border border-foreground/10 bg-card p-4"
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]"
              />
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Author */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl border border-[var(--celo-yellow)]/20 bg-[var(--celo-ink)] p-8 text-[var(--celo-cream)] sm:p-10">
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built by{" "}
            <a
              href={AUTHOR_NPM_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--celo-yellow)] hover:underline"
            >
              @andrewkimjoseph
            </a>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--celo-cream)]/75">
            Celina is maintained as part of the Celo agent ecosystem. Source for the SDK and MCP server lives on
            GitHub; packages ship on npm.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={SDK_GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--celo-cream)]/25 px-4 py-2 text-sm font-medium text-[var(--celo-cream)] transition hover:bg-[var(--celo-cream)]/10"
            >
              <FontAwesomeIcon icon={faGithub} className="h-4 w-4" /> celina-sdk
            </a>
            <a
              href={MCP_GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--celo-cream)]/25 px-4 py-2 text-sm font-medium text-[var(--celo-cream)] transition hover:bg-[var(--celo-cream)]/10"
            >
              <FontAwesomeIcon icon={faGithub} className="h-4 w-4" /> celina-mcp
            </a>
          </div>
          <div className="mt-8 flex items-center gap-3 border-t border-[var(--celo-cream)]/15 pt-6 text-[10px] uppercase tracking-[0.28em] text-[var(--celo-cream)]/60">
            <span>Powered by</span>
            <img src={celoWordmarkYellow} alt="Celo" className="h-3.5 w-auto opacity-95" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a
              className="font-medium text-foreground hover:underline"
              href={AUTHOR_NPM_URL}
              target="_blank"
              rel="noreferrer"
            >
              @andrewkimjoseph
            </a>{" "}
            · MIT
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/tools" className="hover:text-foreground">
              Tools
            </Link>
            <Link to="/sdk" className="hover:text-foreground">
              SDK
            </Link>
            <Link to="/stats" className="hover:text-foreground">
              Stats
            </Link>
            <a href={MCP_NPM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <FontAwesomeIcon icon={faNpm} className="h-4 w-4" /> npm
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
