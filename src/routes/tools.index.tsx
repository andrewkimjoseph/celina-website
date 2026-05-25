import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBolt, faCircleNodes } from "@fortawesome/free-solid-svg-icons";
import { TOOLS, type ToolDoc } from "@/data/tools";
import celinaLogo from "@/assets/celina-logo-clady.png";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/tools/")({
  head: () => {
    const title = "All Celina tools — Celo MCP";
    const desc = `Browse every Celina MCP tool: ${TOOLS.length} read & write operations for Celo mainnet, Mento FX, Aave, GoodDollar and more.`;
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
  const writeCount = TOOLS.length - readCount;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={celinaLogo} alt="Celina" width={36} height={36} className="h-9 w-9" />
            <span className="font-display text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Celina
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-foreground/70 transition hover:text-foreground"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" /> Home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-16">
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Celina</Link>
          <span>/</span>
          <span className="text-foreground/80">Tools</span>
        </div>

        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-foreground">
          § Tools v0.1
        </span>
        <h1
          className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {TOOLS.length} tools. One agent. Whole chain.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every operation Celina exposes to your LLM — {readCount} read, {writeCount} write — across Celo mainnet, Mento FX, Aave and GoodDollar. Click any tool for its full spec.
        </p>

        <nav className="mt-8 flex flex-wrap gap-2 text-sm">
          {categories.map((c) => (
            <a
              key={c}
              href={`#${slugify(c)}`}
              className="rounded-full border border-foreground/15 bg-card px-3 py-1 text-xs font-semibold text-foreground/80 transition hover:border-[var(--celo-forest)]/40 hover:text-foreground"
            >
              {c} <span className="text-muted-foreground">· {byCategory[c].length}</span>
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-14">
          {categories.map((category) => (
            <section key={category} id={slugify(category)} className="scroll-mt-24">
              <div className="mb-4 flex items-baseline justify-between border-b border-foreground/10 pb-3">
                <h2
                  className="text-2xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {category}
                </h2>
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {byCategory[category].length} tool{byCategory[category].length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {byCategory[category].map((t) => {
                  const isWrite = t.kind === "write";
                  return (
                    <Link
                      key={t.name}
                      to="/tools/$toolSlug"
                      params={{ toolSlug: t.slug }}
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
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                            isWrite
                              ? "bg-[var(--celo-yellow)] text-[var(--celo-ink)]"
                              : "border border-[var(--celo-yellow)]/40 text-[var(--celo-yellow)]"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={isWrite ? faBolt : faCircleNodes}
                            className="h-2.5 w-2.5"
                          />
                          {t.kind}
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