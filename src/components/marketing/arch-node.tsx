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
      className={`rounded-xl border px-4 py-3 text-center ${
        highlight
          ? "border-[var(--celo-yellow)]/50 bg-[var(--celo-yellow)]/10"
          : "border-foreground/10 bg-card"
      }`}
    >
      <p className="font-mono text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
