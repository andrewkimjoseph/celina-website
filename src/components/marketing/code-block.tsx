import { useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="inline-flex items-center gap-1.5 rounded-[2px] border-2 border-foreground bg-background px-2.5 py-1 text-xs font-medium text-foreground/80 shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color,color] hover:bg-accent hover:text-accent-foreground active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
    >
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="h-3.5 w-3.5" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function ShellCommand({
  command,
  prompt = "$",
  className = "",
}: {
  command: string;
  prompt?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex max-w-full items-center gap-2 overflow-hidden rounded-[2px] border-2 border-foreground bg-[var(--celo-ink)] py-2 pl-4 pr-2 text-[12px] text-[var(--celo-cream)] shadow-[var(--shadow-brutal-sm)] sm:text-sm ${className}`}
    >
      <span className="font-mono text-[var(--celo-yellow)]">{prompt}</span>
      <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono">{command}</code>
      <CopyButton text={command} />
    </div>
  );
}

export function EndpointCopyCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: ReactNode;
}) {
  return (
    <div className="rounded-[2px] border-2 border-foreground bg-muted/30 p-4 text-sm">
      <p className="font-medium text-foreground">{label}</p>
      <div className="mt-2 flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-background px-3 py-2">
        <code className="flex-1 overflow-x-auto break-all font-mono text-xs text-muted-foreground">
          {value}
        </code>
        <CopyButton text={value} />
      </div>
      {hint ? <div className="mt-2 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <div className="absolute right-3 top-3 z-10">
        <CopyButton text={code} />
      </div>
      <pre className="overflow-hidden whitespace-pre-wrap break-all rounded-[2px] border-2 border-foreground bg-[var(--celo-ink)] p-4 pr-20 text-[12px] leading-relaxed text-[var(--celo-cream)] shadow-[var(--shadow-brutal)] sm:p-5 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
