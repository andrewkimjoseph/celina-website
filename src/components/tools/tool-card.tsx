import { Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faCircleNodes, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { categorySlug, type ToolDoc, type ToolKind } from "@/data/tools";

export function kindBadge(kind: ToolKind): {
  icon: typeof faBolt;
  className: string;
} {
  if (kind === "write") {
    return {
      icon: faBolt,
      className: "bg-[var(--celo-yellow)] text-[var(--celo-ink)]",
    };
  }
  if (kind === "prepare") {
    return {
      icon: faPenToSquare,
      className:
        "bg-background text-foreground dark:bg-[var(--celo-cream)]/10 dark:text-[var(--celo-cream)]",
    };
  }
  return {
    icon: faCircleNodes,
    className:
      "bg-[var(--celo-forest)] text-[var(--celo-yellow)] dark:bg-[var(--celo-yellow)]/15 dark:text-[var(--celo-yellow)]",
  };
}

export function ToolCard({ tool }: { tool: ToolDoc }) {
  const badge = kindBadge(tool.kind);
  return (
    <Link
      to="/tools/$category/$toolSlug"
      params={{ category: categorySlug(tool.category), toolSlug: tool.slug }}
      className="group relative block overflow-hidden rounded-[2px] border-2 border-foreground bg-card p-4 shadow-[var(--shadow-brutal-sm)] transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-brutal-lg)]"
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1 bg-[var(--celo-yellow)] opacity-0 transition-opacity group-hover:opacity-100"
      />
      <div className="flex items-center justify-between gap-2">
        <code className="truncate font-mono text-sm font-semibold text-foreground group-hover:underline">
          {tool.name}
        </code>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-[2px] border-2 border-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${badge.className}`}
        >
          <FontAwesomeIcon icon={badge.icon} className="h-2.5 w-2.5" />
          {tool.kind}
        </span>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{tool.summary}</p>
    </Link>
  );
}
