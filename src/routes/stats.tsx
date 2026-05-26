import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotate,
  faChartLine,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { faNpm, faGithub } from "@fortawesome/free-brands-svg-icons";
import { useStatsStore, STALE_MS } from "@/lib/stats-store";
import { useNpmStore } from "@/lib/npm-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { NPM_URL, timeAgo } from "@/lib/stats-shared";
import celinaLogoCelo from "@/assets/celina-logo-celo.png";
import celinaLogoBlack from "@/assets/celina-logo-black.png";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Celina stats" },
      {
        name: "description",
        content:
          "Live stats for Celina — on-chain activity on Celo and npm package downloads.",
      },
      { property: "og:title", content: "Celina stats" },
      {
        property: "og:description",
        content:
          "Live stats for Celina — on-chain activity on Celo and npm package downloads.",
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
      className="rounded-full border border-transparent px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      activeProps={{
        className:
          "rounded-full border border-foreground/15 bg-card px-3.5 py-1.5 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)]",
      }}
    >
      {label}
    </Link>
  );
}

function StatsLayout() {
  const { fetchedAt, loading, error, refresh } = useStatsStore();
  const {
    fetchedAt: npmFetchedAt,
    loading: npmLoading,
    error: npmError,
    refresh: refreshNpm,
  } = useNpmStore();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    refresh();
    refreshNpm();
    const refetchId = setInterval(() => {
      refresh();
      refreshNpm();
    }, STALE_MS);
    const tickId = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(refetchId);
      clearInterval(tickId);
    };
  }, [refresh, refreshNpm]);

  const oldestFetchedAt =
    fetchedAt && npmFetchedAt
      ? Math.min(fetchedAt, npmFetchedAt)
      : fetchedAt || npmFetchedAt;
  const msUntilReady = oldestFetchedAt
    ? Math.max(0, STALE_MS - (now - oldestFetchedAt))
    : 0;
  const cooldown = msUntilReady > 0;
  const cooldownLabel = (() => {
    const s = Math.ceil(msUntilReady / 1000);
    if (s >= 60) return `Refresh in ${Math.ceil(s / 60)}m`;
    return `Refresh in ${s}s`;
  })();
  const busy = loading || npmLoading;
  const combinedError = error || npmError;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={celinaLogoBlack} alt="Celina" width={36} height={36} className="h-9 w-9 dark:hidden" />
            <img src={celinaLogoCelo} alt="" aria-hidden width={36} height={36} className="hidden h-9 w-9 dark:block" />
            <span className="font-display text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Celina</span>
            <span className="hidden text-xs uppercase tracking-[0.18em] text-muted-foreground sm:inline">· Celo MCP</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/" className="hidden rounded-md px-3 py-1.5 text-foreground/70 transition hover:text-foreground sm:inline">Home</Link>
            <Link to="/tools" className="hidden rounded-md px-3 py-1.5 text-foreground/70 transition hover:text-foreground sm:inline">Tools</Link>
            <Link to="/stats" className="hidden rounded-md px-3 py-1.5 font-semibold text-foreground sm:inline">Stats</Link>
            <a href={NPM_URL} target="_blank" rel="noreferrer" className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-[var(--celo-forest)] px-3 py-1.5 text-sm font-medium text-[var(--celo-cream)] transition hover:bg-[var(--celo-deep)] dark:bg-white dark:text-[var(--celo-ink)] dark:hover:bg-[var(--celo-yellow)]">
              <FontAwesomeIcon icon={faNpm} className="h-3.5 w-3.5" /> npm
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6 sm:px-6 sm:pt-16">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--celo-forest)]/40 bg-card/80 px-3 py-1 text-xs font-medium text-foreground">
              <FontAwesomeIcon icon={faChartLine} className="h-3 w-3 text-[var(--celo-yellow)]" />
              <span className="uppercase tracking-[0.18em]">Live · Updated {timeAgo(oldestFetchedAt)}</span>
            </div>
            <h1
              className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Celina stats
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              On-chain activity on Celo and npm package downloads — refreshed every 5 minutes.
            </p>
          </div>
          <button
            onClick={() => {
              refresh();
              refreshNpm();
            }}
            disabled={busy || cooldown}
            className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 bg-card px-3.5 py-2 text-sm font-medium text-foreground transition hover:border-[var(--celo-yellow)] hover:bg-muted disabled:opacity-60"
          >
            <FontAwesomeIcon
              icon={faRotate}
              className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`}
            />
            {busy ? "Refreshing" : cooldown ? cooldownLabel : "Refresh"}
          </button>
        </div>

        {combinedError && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-4 w-4 text-destructive" />
            <span>{combinedError}</span>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-foreground/10 pb-4">
          <SubNavLink to="/stats" label="Overview" />
          <SubNavLink to="/stats/onchain" label="On-chain" />
          <SubNavLink to="/stats/package" label="Package" />
        </div>
      </section>

      <Outlet />

      <footer className="border-t border-foreground/10">
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