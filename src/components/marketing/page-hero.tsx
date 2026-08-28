import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";

export type Crumb = {
  label: string;
  to?: string;
  params?: Record<string, string>;
};

export function PageCrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="inline-flex items-center gap-2">
            {i > 0 ? <span>/</span> : null}
            {isLast || !item.to ? (
              <span className="text-foreground/80">{item.label}</span>
            ) : (
              <Link to={item.to} params={item.params} className="hover:text-foreground">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

type PageHeroProps = {
  icon: IconDefinition;
  badge: string;
  title: string;
  description?: React.ReactNode;
  /** Wider lead copy for pages with longer intros (e.g. SDK). */
  wide?: boolean;
  crumbs?: Crumb[];
  children?: React.ReactNode;
};

export function PageHeroSection({
  compact,
  children,
}: {
  /** Tighter bottom padding when sub-nav sits in the same section (MCP, stats). */
  compact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16 ${compact ? "pb-6" : "pb-10"}`}
    >
      {children}
    </section>
  );
}

export function PageHero({
  icon,
  badge,
  title,
  description,
  wide,
  crumbs,
  children,
}: PageHeroProps) {
  return (
    <div>
      {crumbs ? <PageCrumbs items={crumbs} /> : null}
      <div className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-background px-3 py-1 text-xs font-medium text-foreground shadow-[var(--shadow-brutal-sm)]">
        <FontAwesomeIcon
          icon={icon}
          className="h-3 w-3 text-[var(--celo-forest)] dark:text-foreground"
        />
        <span className="uppercase tracking-[0.18em]">{badge}</span>
      </div>
      <h1
        className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={`mt-3 text-base leading-relaxed text-muted-foreground ${wide ? "max-w-2xl" : "max-w-xl"}`}
        >
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-7">{children}</div> : null}
    </div>
  );
}
