"use client";

import { useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { copyToClipboard } from "@/lib/copy-to-clipboard";

const COPY_SIZE_CLASS = {
  default:
    "px-2.5 py-1 text-xs shadow-[var(--shadow-brutal-sm)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
  chip: "px-3 py-1.5 text-sm",
  sm: "px-2 py-1 text-[11px]",
} as const;

const COPY_ICON_CLASS = {
  default: "h-3.5 w-3.5",
  chip: "h-3.5 w-3.5",
  sm: "h-3 w-3",
} as const;

export function CopyButton({
  text,
  size = "default",
}: {
  text: string;
  size?: keyof typeof COPY_SIZE_CLASS;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyToClipboard(text);
        if (!ok) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-[2px] border-2 border-foreground bg-background font-medium text-foreground/80 transition-[transform,box-shadow,background-color,color] hover:bg-accent hover:text-accent-foreground ${COPY_SIZE_CLASS[size]}`}
    >
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={COPY_ICON_CLASS[size]} />
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
      className={`flex w-full max-w-full items-center gap-2 overflow-hidden rounded-[2px] border-2 border-foreground bg-[var(--celo-ink)] py-2 pl-4 pr-2 text-[12px] text-[var(--celo-cream)] shadow-[var(--shadow-brutal-yellow-sm)] sm:text-sm ${className}`}
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
        <code className="min-w-0 flex-1 overflow-x-auto break-all font-mono text-xs text-muted-foreground">
          {value}
        </code>
        <CopyButton text={value} />
      </div>
      {hint ? <div className="mt-2 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export function ToolNamesCopyCard({
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
      <div className="relative mt-2 rounded-[2px] border-2 border-foreground bg-background p-2">
        <div className="absolute right-2 top-2 z-10">
          <CopyButton text={value} />
        </div>
        <code className="block whitespace-pre-wrap break-all font-mono text-xs leading-snug text-muted-foreground">
          {value}
        </code>
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
      <pre className="overflow-hidden whitespace-pre-wrap break-all rounded-[2px] border-2 border-foreground bg-[var(--celo-ink)] p-4 pr-20 text-[12px] leading-relaxed text-[var(--celo-cream)] shadow-[var(--shadow-brutal-yellow)] sm:p-5 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
