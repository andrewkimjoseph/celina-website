import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { useStatsStore } from "@/lib/stats-store";
import {
  KpiCard,
  ChartCard,
  aggregate,
  tooltipStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
  yellow,
  lineStroke,
  forest,
  truncate,
  formatDateTime,
  DUNE_DASHBOARD_URL,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "@/lib/stats-shared";

export const Route = createFileRoute("/stats/onchain")({
  head: () => ({
    meta: [
      { title: "Celina stats — On-chain activity" },
      {
        name: "description",
        content:
          "Live on-chain stats for transactions tagged CELINA on Celo mainnet — sourced from Dune Analytics.",
      },
      { property: "og:title", content: "Celina stats — On-chain activity" },
      {
        property: "og:description",
        content:
          "Live on-chain stats for transactions tagged CELINA on Celo mainnet — sourced from Dune Analytics.",
      },
    ],
  }),
  component: OnchainPage,
});

function OnchainPage() {
  const { rows, loading, error, partial } = useStatsStore();
  const unavailable = Boolean(error) && !partial && rows.length === 0;
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const agg = useMemo(() => aggregate(rows), [rows]);
  const txs = useMemo(
    () => [...rows].sort((a, b) => b.block_time.localeCompare(a.block_time)),
    [rows],
  );
  const totalPages = Math.max(1, Math.ceil(txs.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = txs.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--celo-forest)]/40 bg-card/80 px-3 py-1 text-[10px] font-medium text-foreground sm:text-xs">
              <FontAwesomeIcon icon={faChartLine} className="h-3 w-3 shrink-0 text-[var(--celo-forest)] dark:text-foreground" />
              <span className="uppercase tracking-[0.18em]">On-chain · Dune Analytics</span>
            </div>
            <h2
              className="mt-3 text-xl font-bold tracking-tight sm:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Celo mainnet transactions tagged CELINA
            </h2>
          </div>
          <a
            href={DUNE_DASHBOARD_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 self-start text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            Dune query
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard label="Total txns" value={unavailable ? "—" : agg.totalTx.toLocaleString()} />
          <KpiCard label="Today" value={unavailable ? "—" : agg.todayCount.toLocaleString()} />
          <KpiCard label="Days active" value={unavailable ? "—" : agg.uniqueDays} />
          <KpiCard label="Unique receivers" value={unavailable ? "—" : agg.uniqueReceivers} />
          <KpiCard label="Unique senders" value={unavailable ? "—" : agg.uniqueSenders} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        {unavailable ? (
          <div className="rounded-2xl border border-foreground/10 bg-card p-10 text-center shadow-[var(--shadow-soft)]">
            <p className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              On-chain stats are temporarily unavailable.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Our data provider (Dune Analytics) is currently unreachable. Off-chain and package stats are still available.
            </p>
          </div>
        ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Cumulative transactions" subtitle="all time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={agg.daily} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ stroke: "var(--border)" }} />
                <Line type="monotone" dataKey="cumulative" name="Cumulative" stroke={lineStroke} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: lineStroke }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Daily transactions" subtitle="per day">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agg.daily} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
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
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Txns" fill={forest} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top receivers" subtitle="address · txns">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agg.topReceivers.map((r) => ({ ...r, short: truncate(r.address, 6, 4) }))} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="short" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={92} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
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
              <BarChart data={agg.topSenders.map((r) => ({ ...r, short: truncate(r.address, 6, 4) }))} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="short" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={92} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
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
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} formatter={(v) => `${v}%`} />
                <Bar dataKey="share" name="Share" fill={yellow} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        )}
      </section>

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
            <table className="w-full text-sm">
              <thead className="border-b border-foreground/10 bg-muted/40 text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <tr>
                  <th className="w-px whitespace-nowrap py-3 pl-3 pr-1 font-medium">#</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">When</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">Block</th>
                  <th className="px-3 py-3 font-medium">From</th>
                  <th className="px-3 py-3 font-medium">To</th>
                  <th className="px-3 py-3 font-medium">Hash</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      {unavailable ? (
                        <div>
                          <p className="font-medium text-foreground">On-chain stats are temporarily unavailable.</p>
                          <p className="mt-1 text-sm">Our data provider (Dune Analytics) is currently unreachable.</p>
                        </div>
                      ) : (
                        "No transactions yet."
                      )}
                    </td>
                  </tr>
                )}
                {pageRows.map((r, i) => (
                  <tr key={r.hash} className="border-b border-foreground/5 last:border-0 hover:bg-muted/30">
                    <td className="w-px whitespace-nowrap py-3 pl-3 pr-1 text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {currentPage * pageSize + i + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-foreground/80">{formatDateTime(r.block_time)}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-muted-foreground">{r.block_number.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <a href={`https://celoscan.io/address/${r.from}`} target="_blank" rel="noreferrer" className="font-mono text-xs text-foreground/80 hover:text-foreground hover:underline">{truncate(r.from, 10, 8)}</a>
                    </td>
                    <td className="px-3 py-3">
                      <a href={`https://celoscan.io/address/${r.to}`} target="_blank" rel="noreferrer" className="font-mono text-xs text-foreground/80 hover:text-foreground hover:underline">{truncate(r.to, 10, 8)}</a>
                    </td>
                    <td className="px-3 py-3">
                      <a href={`https://celoscan.io/tx/${r.hash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--celo-forest)] hover:underline dark:text-[var(--celo-yellow)]">
                        {truncate(r.hash, 6, 4)}
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5 shrink-0" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 0 && (
            <div className="flex items-center justify-between gap-2 border-t border-foreground/10 px-4 py-3 text-xs text-muted-foreground">
              <span>
                {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, rows.length)} of{" "}
                {rows.length.toLocaleString()} txn{rows.length === 1 ? "" : "s"}
                {totalPages > 1 && (
                  <>
                    {" "}
                    · page {currentPage + 1} of {totalPages}
                  </>
                )}
              </span>
              {totalPages > 1 && (
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0} className="rounded-md border border-foreground/15 px-3 py-1.5 text-foreground/80 transition hover:bg-muted disabled:opacity-40">Prev</button>
                  <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1} className="rounded-md border border-foreground/15 px-3 py-1.5 text-foreground/80 transition hover:bg-muted disabled:opacity-40">Next</button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}