export function ArchNode({
  label,
  detail,
  highlight,
}: {
  label: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[2px] border-2 border-foreground px-4 py-3 text-center shadow-[var(--shadow-brutal-sm)] ${
        highlight ? "bg-[var(--celo-yellow)]" : "bg-card"
      }`}
    >
      <p
        className={`font-mono text-sm font-semibold ${highlight ? "text-[var(--celo-ink)]" : "text-foreground"}`}
      >
        {label}
      </p>
      <p className={`mt-1 text-xs ${highlight ? "text-[var(--celo-ink)]/70" : "text-muted-foreground"}`}>
        {detail}
      </p>
    </div>
  );
}
