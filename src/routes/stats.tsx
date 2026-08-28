import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotate,
  faChartLine,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faNpm } from "@fortawesome/free-brands-svg-icons";
import { useStatsStore, STALE_MS } from "@/lib/stats-store";
import { useNpmStore } from "@/lib/npm-store";
import { useAmplitudeStore } from "@/lib/amplitude-store";
import { SiteHeader } from "@/components/site-header";
import { PageCrumbs } from "@/components/marketing/page-hero";
import { NPM_URL, timeAgo } from "@/lib/stats-shared";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Celina stats" },
      {
        name: "description",
        content:
          "Stats for Celina — on-chain activity, off-chain tool calls, wallets queried, and npm downloads.",
      },
      { property: "og:title", content: "Celina stats" },
      {
        property: "og:description",
        content:
          "Stats for Celina — on-chain activity, off-chain tool calls, wallets queried, and npm downloads.",
      },
    ],
  }),
  component: StatsLayout,
});

function SubNavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className="rounded-[2px] border-2 border-transparent px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      activeProps={{
        className:
          "rounded-[2px] border-2 border-foreground bg-[var(--celo-forest)] px-3.5 py-1.5 text-sm font-semibold !text-white shadow-[var(--shadow-brutal-sm)] dark:bg-[var(--celo-yellow)] dark:!text-black",
      }}
    >
      {label}
    </Link>
  );
}

function StatsLayout() {
  const { fetchedAt, loading, error, partial, refresh } = useStatsStore();
  const {
    fetchedAt: npmFetchedAt,
    loading: npmLoading,
    error: npmError,
    partial: npmPartial,
    refresh: refreshNpm,
  } = useNpmStore();
  const {
    fetchedAt: ampFetchedAt,
    loading: ampLoading,
    error: ampError,
    partial: ampPartial,
    refresh: refreshAmp,
  } = useAmplitudeStore();
  const [now, setNow] = useState(() => Date.now());
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    refresh();
    refreshNpm();
    refreshAmp();
    const tickId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tickId);
  }, [refresh, refreshNpm, refreshAmp]);

  const fetchedAts = [fetchedAt, npmFetchedAt, ampFetchedAt].filter(
    (v): v is number => typeof v === "number",
  );
  const oldestFetchedAt = fetchedAts.length ? Math.min(...fetchedAts) : null;
  const msUntilReady = oldestFetchedAt
    ? Math.max(0, STALE_MS - (now - oldestFetchedAt))
    : 0;
  const cooldown = msUntilReady > 0;
  const cooldownLabel = (() => {
    const s = Math.ceil(msUntilReady / 1000);
    if (s >= 3600) return `Refresh in ${Math.ceil(s / 3600)}h`;
    if (s >= 60) return `Refresh in ${Math.ceil(s / 60)}m`;
    return `Refresh in ${s}s`;
  })();
  const busy = loading || npmLoading || ampLoading;
  const combinedError = (() => {
    if (pathname.startsWith("/stats/onchain")) return null;
    if (pathname.startsWith("/stats/package")) return npmPartial ? null : npmError;
    if (pathname.startsWith("/stats/offchain")) return ampPartial ? null : ampError;
    return (
      (npmPartial ? null : npmError) ||
      (ampPartial ? null : ampError)
    );
  })();
  const showNpmPartial =
    pathname.startsWith("/stats/package") && npmPartial && npmError;
  const showAmpPartial = ampPartial && ampError;
  const showOnchainPartial =
    pathname.startsWith("/stats/onchain") && partial && error;
  const showOnchainUnavailable =
    pathname.startsWith("/stats/onchain") && error && !partial;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6 sm:px-6 sm:pt-16">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <PageCrumbs
              items={[
                { label: "Celina", to: "/" },
                { label: "Stats", to: "/stats" },
                pathname.startsWith("/stats/onchain")
                  ? { label: "On-chain" }
                  : pathname.startsWith("/stats/offchain")
                    ? { label: "Off-chain" }
                    : pathname.startsWith("/stats/package")
                      ? { label: "Package" }
                      : { label: "Overview" },
              ]}
            />
            <div className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-background px-3 py-1 text-xs font-medium text-foreground shadow-[var(--shadow-brutal-sm)]">
              <FontAwesomeIcon icon={faChartLine} className="h-3 w-3 text-[var(--celo-forest)] dark:text-foreground" />
              <span className="uppercase tracking-[0.18em]">Updated {timeAgo(oldestFetchedAt)}</span>
            </div>
            <h1
              className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Celina stats
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              On-chain activity on Celo and npm package downloads — data updates daily; refresh available once per day.
            </p>
          </div>
          <button
            onClick={() => {
              void refresh();
              void refreshNpm();
              void refreshAmp();
            }}
            disabled={busy || cooldown}
            className="inline-flex items-center gap-2 rounded-[2px] border-2 border-foreground bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-brutal-sm)] transition-[transform,box-shadow,background-color] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-60 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[var(--shadow-brutal-sm)]"
          >
            <FontAwesomeIcon
              icon={faRotate}
              className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`}
            />
            {busy ? "Refreshing" : cooldown ? cooldownLabel : "Refresh"}
          </button>
        </div>

        {combinedError && (
          <div className="mt-6 flex items-start gap-3 rounded-[2px] border-2 border-destructive bg-destructive/10 p-4 text-sm text-foreground">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-4 w-4 text-destructive" />
            <span>{combinedError}</span>
          </div>
        )}

        {showNpmPartial && (
          <div className="mt-6 flex items-start gap-3 rounded-[2px] border-2 border-[var(--celo-forest)] bg-[var(--celo-yellow)]/10 p-4 text-sm text-foreground dark:border-[var(--celo-yellow)]">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-4 w-4 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]" />
            <span>{npmError}</span>
          </div>
        )}

        {showAmpPartial && (
          <div className="mt-6 flex items-start gap-3 rounded-[2px] border-2 border-[var(--celo-forest)] bg-[var(--celo-yellow)]/10 p-4 text-sm text-foreground dark:border-[var(--celo-yellow)]">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-4 w-4 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]" />
            <span>
              Off-chain refresh failed — showing cached data. {ampError}
            </span>
          </div>
        )}

        {showOnchainPartial && (
          <div className="mt-6 flex items-start gap-3 rounded-[2px] border-2 border-[var(--celo-forest)] bg-[var(--celo-yellow)]/10 p-4 text-sm text-foreground dark:border-[var(--celo-yellow)]">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-4 w-4 text-[var(--celo-forest)] dark:text-[var(--celo-yellow)]" />
            <span>Showing cached on-chain data (outdated).</span>
          </div>
        )}

        {showOnchainUnavailable && (
          <div className="mt-6 flex items-start gap-3 rounded-[2px] border-2 border-foreground bg-muted/40 p-4 text-sm text-foreground">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-2 border-b-2 border-foreground pb-4">
          <SubNavLink to="/stats" label="Overview" />
          <SubNavLink to="/stats/onchain" label="On-chain" />
          <SubNavLink to="/stats/offchain" label="Off-chain" />
          <SubNavLink to="/stats/package" label="Package" />
        </div>
      </section>

      <Outlet />

      <footer className="border-t-2 border-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Built by <a className="font-medium text-foreground hover:underline" href="https://www.npmjs.com/~andrewkimjoseph" target="_blank" rel="noreferrer">@andrewkimjoseph</a> · MIT
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/stats" className="hover:text-foreground">Stats</Link>
            <a href={NPM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <FontAwesomeIcon icon={faNpm} className="h-4 w-4" /> npm
            </a>
            <a href="https://modelcontextprotocol.io/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <FontAwesomeIcon icon={faGithub} className="h-4 w-4" /> MCP spec
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}