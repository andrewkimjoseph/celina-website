import { SiteHeader } from "@/components/site-header";
import { PageCrumbs } from "@/components/marketing/page-hero";
import { ToolsKindNav } from "@/components/tools/kind-nav";
import { ToolCategoryGrid } from "@/components/tools/category-grid";
import { toolsByKind, type ToolKind } from "@/data/tools";

export function ToolsKindHub({
  kind,
  title,
  description,
}: {
  kind: ToolKind;
  title: string;
  description: string;
}) {
  const tools = toolsByKind(kind);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-16">
        <PageCrumbs
          items={[
            { label: "Celina", to: "/" },
            { label: "Tools", to: "/tools" },
            { label: title },
          ]}
        />

        <span className="rounded-[2px] border-2 border-foreground bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-foreground shadow-[var(--shadow-brutal-sm)]">
          § {title}
        </span>
        <h1
          className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title} tools
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {description} {tools.length} tool{tools.length === 1 ? "" : "s"}.
        </p>

        <ToolsKindNav />
        <ToolCategoryGrid tools={tools} />
      </section>
    </main>
  );
}
