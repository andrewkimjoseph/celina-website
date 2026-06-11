import { useState } from "react";
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
      className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground/80 backdrop-blur transition hover:bg-accent hover:text-accent-foreground"
    >
      <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="h-3.5 w-3.5" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <div className="absolute right-3 top-3 z-10">
        <CopyButton text={code} />
      </div>
      <pre className="overflow-hidden whitespace-pre-wrap break-all rounded-xl border border-[var(--celo-deep)]/40 bg-[var(--celo-ink)] p-4 pr-20 text-[12px] leading-relaxed text-[var(--celo-cream)] shadow-[var(--shadow-soft)] sm:p-5 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
