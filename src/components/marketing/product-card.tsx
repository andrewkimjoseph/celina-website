import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ProductCard({
  icon,
  iconImage,
  title,
  subtitle,
  body,
  children,
}: {
  icon?: IconDefinition;
  iconImage?: { src: string; alt: string };
  title: string;
  subtitle: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-[2px] border-2 border-foreground bg-card p-6 shadow-[var(--shadow-brutal)] transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-brutal-lg)]">
      <div className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-[2px] border-2 border-foreground bg-[var(--celo-yellow)] text-[var(--celo-ink)]">
        {iconImage ? (
          <img
            src={iconImage.src}
            alt={iconImage.alt}
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
        ) : icon ? (
          <FontAwesomeIcon icon={icon} className="h-4 w-4" />
        ) : null}
      </div>
      <h3
        className="mt-4 text-lg font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {subtitle}
      </p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
