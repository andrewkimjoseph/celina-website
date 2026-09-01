import { Link } from "@tanstack/react-router";
import { categorySlug, groupToolsByCategory, type ToolDoc } from "@/data/tools";
import { ToolCard } from "@/components/tools/tool-card";

export function ToolCategoryGrid({ tools }: { tools: ToolDoc[] }) {
  const groups = groupToolsByCategory(tools);
  return (
    <div className="mt-12 space-y-14">
      {groups.map(({ category, tools: grouped }) => (
        <section
          key={category}
          id={categorySlug(category)}
          className="scroll-mt-24"
        >
          <div className="mb-4 flex items-baseline justify-between border-b-2 border-foreground pb-3">
            <Link
              to="/tools/$category"
              params={{ category: categorySlug(category) }}
              className="text-2xl font-bold tracking-tight transition hover:text-[var(--celo-forest)] dark:hover:text-[var(--celo-yellow)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {category}
            </Link>
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {grouped.length} tool{grouped.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
