import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBolt, faCircleNodes, faFileSignature } from "@fortawesome/free-solid-svg-icons";
import { TOOLS, CATEGORY_BY_SLUG, categorySlug, type ToolDoc } from "@/data/tools";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/tools/$category/")({
  loader: ({ params }) => {
    const category = CATEGORY_BY_SLUG[params.category];
    if (!category) throw notFound();
    const tools = TOOLS.filter((t) => t.category === category);
    return { category, tools };
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.category;
    if (!cat) return { meta: [{ title: "Category not found — Celina" }] };
    const count = loaderData?.tools.length ?? 0;
    const title = `${cat} tools — Celina MCP`;
    const desc = `Every Celina MCP tool in the ${cat} category — ${count} operations for Celo mainnet.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="text-3xl font-bold">Category not found</h1>
        <p className="mt-2 text-muted-foreground">No Celina tool category matches that URL.</p>
        <Link to="/tools" className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--celo-deep)] px-4 py-2 text-sm font-medium text-[var(--celo-cream)]">
          <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" /> All tools
        </Link>
      </div>
    </div>
  ),
});

function CategoryPage() {
  const { category, tools } = Route.useLoaderData() as {
    category: ToolDoc["category"];
    tools: ToolDoc[];
  };
  const catSlug = categorySlug(category);
  const readCount = tools.filter((t) => t.kind === "read").length;
  const writeCount = tools.filter((t) => t.kind === "write").length;
  const prepareCount = tools.filter((t) => t.kind === "prepare").length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-16">
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Celina</Link>
          <span>/</span>
          <Link to="/tools" className="hover:text-foreground">Tools</Link>
          <span>/</span>
          <span className="text-foreground/80">{category}</span>
        </div>

        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-foreground">
          § {category}
        </span>
        <h1
          className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {category} tools
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {tools.length} tool{tools.length === 1 ? "" : "s"} in this category — {readCount} read, {writeCount} write, {prepareCount} prep.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => {
            const isWrite = t.kind === "write";
            const isPrepare = t.kind === "prepare";
            const kindLabel = isPrepare ? "PREP" : t.kind;
            const kindIcon = isPrepare ? faFileSignature : isWrite ? faBolt : faCircleNodes;
            const badgeClass = isPrepare
              ? "bg-[var(--celo-deep)] text-[var(--celo-cream)] dark:bg-[var(--celo-yellow)] dark:text-[var(--celo-ink)]"
              : isWrite
                ? "bg-[var(--celo-yellow)] text-[var(--celo-ink)]"
                : "bg-[var(--celo-forest)] text-[var(--celo-yellow)] dark:bg-[var(--celo-yellow)]/15 dark:text-[var(--celo-yellow)] dark:border dark:border-[var(--celo-yellow)]/40";
            return (
              <Link
                key={t.name}
                to="/tools/$category/$toolSlug"
                params={{ category: catSlug, toolSlug: t.slug }}
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
    </main>
  );
}