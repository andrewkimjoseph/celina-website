import { Link } from "@tanstack/react-router";

const LINKS = [
  { to: "/tools", label: "All", exact: true },
  { to: "/tools/read", label: "Read" },
  { to: "/tools/write", label: "Write" },
  { to: "/tools/prepare", label: "Prepare" },
] as const;

export function ToolsKindNav() {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2 border-b-2 border-foreground pb-4">
      {LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          activeOptions={{ exact: "exact" in link ? link.exact : true }}
          className="rounded-[2px] border-2 border-transparent px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          activeProps={{
            className:
              "rounded-[2px] border-2 border-foreground bg-[var(--celo-forest)] px-3.5 py-1.5 text-sm font-semibold !text-white shadow-[var(--shadow-brutal-sm)] dark:bg-[var(--celo-yellow)] dark:!text-[var(--celo-ink)]",
          }}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
