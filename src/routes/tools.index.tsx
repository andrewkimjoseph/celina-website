import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faCircleNodes, faFileSignature } from "@fortawesome/free-solid-svg-icons";
import { TOOLS, type ToolDoc, categorySlug } from "@/data/tools";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/tools/")({
  head: () => {
    const title = "All Celina tools — Celo MCP";
    const desc = `Browse every Celina MCP tool: ${TOOLS.length} read & write operations across Celo mainnet, Mento FX, Uniswap v4, Aave, GoodDollar, governance, staking, NFTs and raw contract calls.`;
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
  const readCount = TOOLS.filter((t) => t.kind === "read").length;
  const writeCount = TOOLS.filter((t) => t.kind === "write").length;
  const prepareCount = TOOLS.filter((t) => t.kind === "prepare").length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-16">
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Celina</Link>
          <span>/</span>
          <span className="text-foreground/80">Tools</span>
        </div>

        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-foreground">
          § Tools
        </span>
        <h1
          className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {TOOLS.length} tools. One agent. Whole chain.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every operation Celina exposes to your LLM — {readCount} read, {writeCount} write, {prepareCount} prep — across Celo mainnet, Mento FX, Uniswap v4, Aave, Carbon DeFi and GoodDollar. Click any tool for its full spec.
        </p>

        <nav className="mt-8 flex flex-wrap gap-2 text-sm">
          {categories.map((c) => (
            <Link
              key={c}
              to="/tools/$category"
              params={{ category: categorySlug(c as ToolDoc["category"]) }}
              className="rounded-full border border-foreground/15 bg-card px-3 py-1 text-xs font-semibold text-foreground/80 transition hover:border-[var(--celo-forest)]/40 hover:text-foreground"
            >
              {c} <span className="text-muted-foreground">· {byCategory[c].length}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-12 space-y-14">
          {categories.map((category) => (
            <section key={category} id={slugify(category)} className="scroll-mt-24">
              <div className="mb-4 flex items-baseline justify-between border-b border-foreground/10 pb-3">
                <Link
                  to="/tools/$category"
                  params={{ category: categorySlug(category as ToolDoc["category"]) }}
                  className="text-2xl font-bold tracking-tight hover:text-[var(--celo-forest)] dark:hover:text-[var(--celo-yellow)] transition"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {category}
                </Link>
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {byCategory[category].length} tool{byCategory[category].length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {byCategory[category].map((t) => {
                  const isWrite = t.kind === "write";
                  const isPrepare = t.kind === "prepare";
                  const kindLabel = isPrepare ? "PREP" : t.kind;
                  const kindIcon = isPrepare ? faFileSignature : isWrite ? faBolt : faCircleNodes;
                  const badgeClass = isPrepare
                    ? "bg-[var(--celo-deep)] text-[var(--celo-cream)] dark:bg-[var(--celo-cream)] dark:text-[var(--celo-ink)]"
                    : isWrite
                      ? "bg-[var(--celo-yellow)] text-[var(--celo-ink)]"
                      : "bg-[var(--celo-forest)] text-[var(--celo-yellow)] dark:bg-[var(--celo-yellow)]/15 dark:text-[var(--celo-yellow)] dark:border dark:border-[var(--celo-yellow)]/40";
                  return (
                    <Link
                      key={t.name}
                      to="/tools/$category/$toolSlug"
                      params={{ category: categorySlug(t.category), toolSlug: t.slug }}
                      className="group relative block overflow-hidden rounded-xl border border-foreground/10 bg-card p-4 transition hover:-translate-y-0.5 hover:border-[var(--celo-yellow)]/60"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 h-full w-0.5 bg-[var(--celo-yellow)] opacity-0 transition-opacity group-hover:opacity-100"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <code className="truncate font-mono text-sm font-semibold text-foreground group-hover:underline">
                          {t.name}
                        </code>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${badgeClass}`}
                        >
                          <FontAwesomeIcon icon={kindIcon} className="h-2.5 w-2.5" />
                          {kindLabel}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">{t.summary}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}