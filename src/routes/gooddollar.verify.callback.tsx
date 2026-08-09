import { createFileRoute, Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import goodDollarLogo from "@/assets/gooddollar.svg";
import { SiteHeader } from "@/components/site-header";
import {
  parseGoodDollarCallbackSearch,
  type GoodDollarCallbackResult,
} from "@/lib/gooddollar-callback";

const MCP_LOCAL_URL = "https://www.usecelina.xyz/mcp/local";

export const Route = createFileRoute("/gooddollar/verify/callback")({
  head: () => ({
    meta: [
      { title: "GoodDollar verification — Celina" },
      { name: "description", content: "GoodDollar face verification callback for Celina MCP testers." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GoodDollarVerifyCallbackPage,
});

function ParamRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-lg border border-foreground/10 bg-muted/40 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-sm text-foreground">{value}</p>
    </div>
  );
}

function GoodDollarVerifyCallbackPage() {
  const [result, setResult] = useState<GoodDollarCallbackResult | null>(null);

  useEffect(() => {
    setResult(parseGoodDollarCallbackSearch(window.location.search));
  }, []);

  const verified = result?.verified ?? null;
  const isSuccess = verified === true;
  const isFailure = verified === false;
  const isPending = result == null || verified == null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
        <div className="rounded-2xl border border-foreground/10 bg-card p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <img src={goodDollarLogo} alt="GoodDollar" className="mb-4 h-14 w-14" />

            {isSuccess ? (
              <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--celo-yellow)]/20 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]">
                <FontAwesomeIcon icon={faCircleCheck} className="h-8 w-8" />
              </span>
            ) : isFailure ? (
              <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <FontAwesomeIcon icon={faCircleExclamation} className="h-8 w-8" />
              </span>
            ) : (
              <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <FontAwesomeIcon icon={faCircleInfo} className="h-8 w-8" />
              </span>
            )}

            <h1
              className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {isSuccess
                ? "Face verification complete"
                : isFailure
                  ? "Face verification did not pass"
                  : "GoodDollar verification redirect"}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {isSuccess
                ? "GoodDollar redirected you back to Celina successfully. Return to Claude Desktop and ask to run check_humanness to confirm your wallet is verified."
                : isFailure
                  ? "GoodDollar returned a failed verification result. You can retry from Claude by asking for a new face verification link."
                  : "This page receives GoodDollar face verification results when you use Celina MCP. Complete verification from Claude, then you will land here with your result."}
            </p>
          </div>

          {result && !isPending ? (
            <div className="mt-8 space-y-3">
              <ParamRow
                label="Verified"
                value={result.verified == null ? null : result.verified ? "true" : "false"}
              />
              <ParamRow label="Chain" value={result.chain} />
              {result.reason ? <ParamRow label="Reason" value={result.reason} /> : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {isSuccess ? (
              <p className="rounded-lg border border-[var(--celo-yellow)]/30 bg-[var(--celo-yellow)]/10 px-4 py-3 text-center text-sm text-foreground">
                Next step: open Claude and say{" "}
                <span className="font-mono font-medium">Run check_humanness for my wallet.</span>
              </p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 font-medium transition hover:bg-accent"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
              Celina home
            </Link>
            <a
              href={MCP_LOCAL_URL}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              MCP setup guide
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
