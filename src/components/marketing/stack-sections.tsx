import { Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faBolt,
  faChartLine,
  faCircleNodes,
  faCloud,
  faCodeBranch,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { HOSTED_TOOL_COUNT } from "@/data/tools";
import { HOSTED_MCP_URL, STDIO_TOOL_COUNT } from "@/data/mcp";
import { ArchNode } from "@/components/marketing/arch-node";
import { ProductCard } from "@/components/marketing/product-card";

const SDK_DOCS_URL = "https://andrewkimjoseph.gitbook.io/celina-sdk";
const CELESTE_GITHUB_URL = "https://github.com/andrewkimjoseph/celeste-ai";

export function ArchitectureSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <div className="mb-5 flex items-center gap-2">
        <FontAwesomeIcon
          icon={faCircleNodes}
          className="h-4 w-4 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]"
        />
        <h2
          className="text-2xl font-bold tracking-tight sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Architecture
        </h2>
      </div>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Everything flows from the SDK tool catalog. Hosts filter by surface (
        <span className="font-mono text-xs">mcp</span> vs{" "}
        <span className="font-mono text-xs">browser</span>) and wire signing their own way.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ArchNode label="celina-sdk" detail="/tools catalog + services" highlight />
        <ArchNode label="celina-mcp" detail="stdio MCP server" />
        <ArchNode label="mcp.usecelina.xyz" detail="remote hosted HTTP" />
        <ArchNode label="Celeste AI" detail="browser chat UI" />
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        {STDIO_TOOL_COUNT} tools in the full stdio catalog · {HOSTED_TOOL_COUNT} on the remote
        endpoint
      </p>
    </section>
  );
}

export function StackProductsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <h2
        className="mb-5 text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Stack
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard
          icon={faCodeBranch}
          title="Celina SDK"
          subtitle="Core library"
          body="Programmatic reads, wallet signing flows, and the shared LLM tool catalog."
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
        </ProductCard>

        <ProductCard
          icon={faBolt}
          title="Celina MCP"
          subtitle="Local + remote"
          body="Registers the SDK catalog for IDE and CLI agents — local stdio or remote hosted HTTP."
        >
          <Link
            to="/mcp"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
          >
            MCP hub
          </Link>
          <Link
            to="/mcp/local"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
          >
            Local install
          </Link>
        </ProductCard>

        <ProductCard
          icon={faCloud}
          title="Remote MCP"
          subtitle="Streamable HTTP"
          body={`${HOSTED_TOOL_COUNT} tools — chain reads, GoodDollar reserve estimates, and GoodDollar reserve quotes.`}
        >
          <Link
            to="/mcp/remote"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
          >
            Connect remotely
          </Link>
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
          icon={faChartLine}
          title="Tools catalog"
          subtitle="Reference"
          body="Browse all MCP tools by category — reads and writes with full input/output specs."
        >
          <Link
            to="/tools"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
          >
            Browse tools
          </Link>
        </ProductCard>

        <ProductCard
          icon={faChartLine}
          title="Stats"
          subtitle="Live metrics"
          body="On-chain activity, MCP tool calls, unique wallets, and npm package downloads."
        >
          <Link
            to="/stats"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
          >
            View stats
          </Link>
        </ProductCard>

        <ProductCard
          icon={faWandMagicSparkles}
          title="Celeste AI"
          subtitle="Reference browser app"
          body="DeFAI chat UI using surface: browser + wagmi. Users sign in their wallet — no MCP server."
        >
          <a
            href={CELESTE_GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[var(--celo-yellow)]"
          >
            <FontAwesomeIcon icon={faGithub} className="h-3 w-3" /> GitHub
          </a>
        </ProductCard>
      </div>
    </section>
  );
}
