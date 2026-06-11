import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PageHeroProps = {
  icon: IconDefinition;
  badge: string;
  title: string;
  description?: React.ReactNode;
  /** Wider lead copy for pages with longer intros (e.g. SDK). */
  wide?: boolean;
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

export function PageHero({ icon, badge, title, description, wide, children }: PageHeroProps) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--celo-forest)]/40 bg-card/80 px-3 py-1 text-xs font-medium text-foreground">
        <FontAwesomeIcon icon={icon} className="h-3 w-3 text-[var(--celo-forest)] dark:text-foreground" />
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
