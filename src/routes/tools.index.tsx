import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBolt,
  faCircleNodes,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  TOOLS,
  type ToolDoc,
  categorySlug,
  HOSTED_TOOL_COUNT,
  READ_TOOL_COUNT,
  WRITE_TOOL_COUNT,
  PREPARE_TOOL_COUNT,
} from "@/data/tools";
import { SiteHeader } from "@/components/site-header";
import { PageCrumbs } from "@/components/marketing/page-hero";
import { ToolsKindNav } from "@/components/tools/kind-nav";
import { ToolCategoryGrid } from "@/components/tools/category-grid";

export const Route = createFileRoute("/tools/")({
  head: () => {
    const title = "All Celina tools — Celo MCP";
    const desc = `Browse every Celina tool: ${TOOLS.length} operations on Celo mainnet (${HOSTED_TOOL_COUNT} on hosted, full stdio with server-key writes, plus browser prepare). ${READ_TOOL_COUNT} read, ${WRITE_TOOL_COUNT} write, ${PREPARE_TOOL_COUNT} prepare.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ToolsIndex,
});

function ToolsIndex() {
  const byCategory = TOOLS.reduce<Record<string, ToolDoc[]>>((acc, t) => {
    (acc[t.category] ||= []).push(t);
    return acc;
  }, {});
  const categories = Object.keys(byCategory);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-16">
        <PageCrumbs items={[{ label: "Celina", to: "/" }, { label: "Tools" }]} />

        <span className="rounded-[2px] border-2 border-foreground bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-foreground shadow-[var(--shadow-brutal-sm)]">
          § Tools
        </span>
        <h1
          className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {TOOLS.length} tools. One agent. Whole chain.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every operation Celina exposes — {READ_TOOL_COUNT} read, {WRITE_TOOL_COUNT} write,{" "}
          {PREPARE_TOOL_COUNT} prepare — across Celo mainnet, Mento FX, GoodDollar, Uniswap v4, Aave,
          and governance. Click any tool for its full spec.
        </p>

        <ToolsKindNav />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <KindHubCard
            to="/tools/read"
            icon={faCircleNodes}
            title="Read"
            body="Chain state, quotes, and lookups. No keys."
            count={READ_TOOL_COUNT}
          />
          <KindHubCard
            to="/tools/write"
            icon={faBolt}
            title="Write"
            body="Execute and send on MCP with a server key."
            count={WRITE_TOOL_COUNT}
          />
          <KindHubCard
            to="/tools/prepare"
            icon={faPenToSquare}
            title="Prepare"
            body="Unsigned wallet flows. The user signs in browser apps."
            count={PREPARE_TOOL_COUNT}
          />
        </div>

        <nav className="mt-8 flex flex-wrap gap-2 text-sm">
          {categories.map((c) => (
            <Link
              key={c}
              to="/tools/$category"
              params={{ category: categorySlug(c as ToolDoc["category"]) }}
              className="rounded-[2px] border-2 border-foreground bg-card px-3 py-1 text-xs font-semibold text-foreground/80 shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color,color] hover:bg-[var(--celo-yellow)] hover:text-[var(--celo-ink)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              {c} <span className="text-muted-foreground">· {byCategory[c].length}</span>
            </Link>
          ))}
        </nav>

        <ToolCategoryGrid tools={TOOLS} />
      </section>
    </main>
  );
}

function KindHubCard({
  to,
  icon,
  title,
  body,
  count,
}: {
  to: "/tools/read" | "/tools/write" | "/tools/prepare";
  icon: typeof faBolt;
  title: string;
  body: string;
  count: number;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-[2px] border-2 border-foreground bg-card p-6 shadow-[var(--shadow-brutal)] transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-brutal-lg)]"
    >
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-[2px] border-2 border-foreground bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
        <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      </div>
      <h2
        className="mt-4 text-lg font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:underline">
        {count} tools <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
      </span>
    </Link>
  );
}
