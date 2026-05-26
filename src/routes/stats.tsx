import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faRotate,
  faChartLine,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { faNpm, faGithub } from "@fortawesome/free-brands-svg-icons";
import { useStatsStore } from "@/lib/stats-store";
import type { CelinaTxRow } from "@/lib/dune.functions";
import { ThemeToggle } from "@/components/theme-toggle";
import celinaLogoCelo from "@/assets/celina-logo-celo.png";
import celinaLogoBlack from "@/assets/celina-logo-black.png";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Celina — On-chain stats" },
      {
        name: "description",
        content:
          "Live on-chain stats for transactions tagged CELINA on Celo mainnet — sourced from Dune Analytics.",
      },
      { property: "og:title", content: "Celina — On-chain stats" },
      {
        property: "og:description",
        content:
          "Live on-chain stats for transactions tagged CELINA on Celo mainnet — sourced from Dune Analytics.",
      },
    ],
  }),
  component: StatsPage,
});

const NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina";

function truncate(addr: string, head = 6, tail = 4) {
  if (!addr) return "";
  if (addr.length <= head + tail + 1) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

function formatDateTime(s: string) {
  if (!s) return "—";
  const d = new Date(s.replace(" UTC", "Z").replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(s: string) {
  if (!s) return "—";
  const d = new Date(s.replace(" UTC", "Z").replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function timeAgo(ts: number | null) {
  if (!ts) return "never";
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

type Aggregates = {
  totalTx: number;
  uniqueDays: number;
  uniqueReceivers: number;
  uniqueSenders: number;
  todayCount: number;
  daily: Array<{ day: string; label: string; count: number; cumulative: number }>;
  hourly: Array<{ hour: string; count: number }>;
  topReceivers: Array<{ address: string; count: number }>;
  topSenders: Array<{ address: string; count: number }>;
};

function aggregate(rows: CelinaTxRow[]): Aggregates {
  const dayMap = new Map<string, { count: number; cumulative: number }>();
  const recvMap = new Map<string, number>();
  const sendMap = new Map<string, number>();
  const hourMap = new Map<number, number>();

  for (const r of rows) {
    const day = r.day;
    const existing = dayMap.get(day);
    if (!existing || r.cumulative_txns > existing.cumulative) {
      dayMap.set(day, { count: r.txn_count, cumulative: r.cumulative_txns });
    }
    recvMap.set(r.to, (recvMap.get(r.to) ?? 0) + 1);
    sendMap.set(r.from, (sendMap.get(r.from) ?? 0) + 1);
    const d = new Date(r.block_time.replace(" UTC", "Z").replace(" ", "T"));
    if (!Number.isNaN(d.getTime())) {
      const h = d.getUTCHours();
      hourMap.set(h, (hourMap.get(h) ?? 0) + 1);
    }
  }

  const daily = Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, v]) => ({
      day,
      label: formatDateOnly(day),
      count: v.count,
      cumulative: v.cumulative,
    }));

  const hourly = Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2, "0")}:00`,
    count: hourMap.get(h) ?? 0,
  }));

  const topReceivers = Array.from(recvMap.entries())
    .map(([address, count]) => ({ address, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const topSenders = Array.from(sendMap.entries())
    .map(([address, count]) => ({ address, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const totalTx = daily.reduce((m, d) => Math.max(m, d.cumulative), 0);
  const todayStr = daily[daily.length - 1]?.day;
  const todayCount = todayStr ? (dayMap.get(todayStr)?.count ?? 0) : 0;

  return {
    totalTx,
    uniqueDays: daily.length,
    uniqueReceivers: recvMap.size,
    uniqueSenders: sendMap.size,
    todayCount,
    daily,
    hourly,
    topReceivers,
    topSenders,
  };
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h3
          className="text-base font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        {subtitle && (
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
      <div className="h-64 w-full">{children}</div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div
        className="mt-2 text-3xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--foreground)",
  fontSize: 12,
};

function StatsPage() {
  const { rows, fetchedAt, loading, error, refresh } = useStatsStore();
  const [page, setPage] = useState(0);
  const pageSize = 25;

  useEffect(() => {
    refresh();
  }, [refresh]);

  const agg = useMemo(() => aggregate(rows), [rows]);

  const txs = useMemo(
    () =>
      [...rows].sort((a, b) =>
        b.block_time.localeCompare(a.block_time),
      ),
    [rows],
  );
  const totalPages = Math.max(1, Math.ceil(txs.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = txs.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const yellow = "var(--celo-yellow)";
  const forest = "var(--celo-forest)";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav (same shape as landing) */}
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
              <span className="uppercase tracking-[0.18em]">Live · Dune Analytics</span>
            </div>
            <h1
              className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Celina on-chain stats
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Every Celo mainnet transaction tagged{" "}
              <span className="font-mono text-foreground">CELINA</span>, streamed from a Dune query and refreshed on demand.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Updated {timeAgo(fetchedAt)}
            </span>
            <button
              onClick={() => refresh({ force: true })}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 bg-card px-3.5 py-2 text-sm font-medium text-foreground transition hover:border-[var(--celo-yellow)] hover:bg-muted disabled:opacity-60"
            >
              <FontAwesomeIcon
                icon={faRotate}
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Refreshing" : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-4 w-4 text-destructive" />
            <span>{error}</span>
          </div>
        )}
      </section>

      {/* KPIs */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard label="Total txns" value={agg.totalTx.toLocaleString()} />
          <KpiCard label="Today" value={agg.todayCount.toLocaleString()} />
          <KpiCard label="Days active" value={agg.uniqueDays} />
          <KpiCard label="Unique receivers" value={agg.uniqueReceivers} />
          <KpiCard label="Unique senders" value={agg.uniqueSenders} />
        </div>
      </section>

      {/* Charts */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Cumulative transactions" subtitle="all time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={agg.daily} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  name="Cumulative"
                  stroke={yellow}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: yellow }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Daily transactions" subtitle="per day">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agg.daily} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Transactions" fill={yellow} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Hourly activity (UTC)" subtitle="all time">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agg.hourly} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} interval={2} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Txns" fill={forest} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top receivers" subtitle="address · txns">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={agg.topReceivers.map((r) => ({ ...r, short: truncate(r.address, 6, 4) }))}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="short"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={92}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Txns" fill={yellow} radius={[0, 4, 4, 0]}>
                  {agg.topReceivers.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? yellow : forest} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top senders" subtitle="address · txns">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={agg.topSenders.map((r) => ({ ...r, short: truncate(r.address, 6, 4) }))}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="short"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={92}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Txns" fill={forest} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Receiver concentration" subtitle="share of total">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={agg.topReceivers.map((r) => ({
                  short: truncate(r.address, 6, 4),
                  share: agg.totalTx ? +((r.count / rows.length) * 100).toFixed(1) : 0,
                }))}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="short" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} angle={-25} textAnchor="end" height={50} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} unit="%" />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} formatter={(v) => `${v}%`} />
                <Bar dataKey="share" name="Share" fill={yellow} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* Transactions */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Transactions
          </h2>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {rows.length} total
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-[var(--shadow-soft)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-foreground/10 bg-muted/40 text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Block</th>
                  <th className="px-4 py-3 font-medium">From</th>
                  <th className="px-4 py-3 font-medium">To</th>
                  <th className="px-4 py-3 font-medium">Hash</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                      No transactions yet.
                    </td>
                  </tr>
                )}
                {pageRows.map((r) => (
                  <tr
                    key={r.hash}
                    className="border-b border-foreground/5 last:border-0 hover:bg-muted/30"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-foreground/80">
                      {formatDateTime(r.block_time)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                      {r.block_number.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={`https://celoscan.io/address/${r.from}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs text-foreground/80 hover:text-foreground hover:underline"
                      >
                        {truncate(r.from)}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={`https://celoscan.io/address/${r.to}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs text-foreground/80 hover:text-foreground hover:underline"
                      >
                        {truncate(r.to)}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={`https://celoscan.io/tx/${r.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--celo-forest)] hover:underline dark:text-[var(--celo-yellow)]"
                      >
                        {truncate(r.hash, 8, 6)}
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 border-t border-foreground/10 px-4 py-3 text-xs text-muted-foreground">
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="rounded-md border border-foreground/15 px-3 py-1.5 text-foreground/80 transition hover:bg-muted disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="rounded-md border border-foreground/15 px-3 py-1.5 text-foreground/80 transition hover:bg-muted disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
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