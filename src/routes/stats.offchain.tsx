import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { useAmplitudeStore } from "@/lib/amplitude-store";
import { cn } from "@/lib/utils";
import {
  ComposedChart,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  KpiCard,
  ChartCard,
  aggregateAmplitude,
  mergeAmplitudeDailyQueriedWallets,
  formatDateOnly,
  formatDateTime,
  displayProjectId,
  pageWindow,
  pagerBtnClass,
  tooltipStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
  yellow,
  lineStroke,
  forest,
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

export const Route = createFileRoute("/stats/offchain")({
  head: () => ({
    meta: [
      { title: "Celina stats — Off-chain tool calls" },
      {
        name: "description",
        content:
          "Off-chain Celina tool-call stats — read tools, wallets queried, and registry queries.",
      },
      { property: "og:title", content: "Celina stats — Off-chain tool calls" },
      {
        property: "og:description",
        content:
          "Off-chain Celina tool-call stats — read tools, wallets queried, and registry queries.",
      },
    ],
  }),
  component: OffchainPage,
});

function OffchainPage() {
  const { daily, dailyWalletsQueried, perTool, projects, events, walletsQueried, total, loading, lastSyncedAt } =
    useAmplitudeStore();
  const [page, setPage] = useState(0);
  const pageSize = 25;
  const agg = useMemo(() => aggregateAmplitude(daily, perTool), [daily, perTool]);
  const queriedWalletsDaily = useMemo(
    () =>
      [...dailyWalletsQueried]
        .sort((a, b) => a.day.localeCompare(b.day))
        .map((r) => ({
          ...r,
          label: formatDateOnly(r.day),
        })),
    [dailyWalletsQueried],
  );
  const dailyCallsAndQueriedWallets = useMemo(
    () => mergeAmplitudeDailyQueriedWallets(daily, dailyWalletsQueried),
    [daily, dailyWalletsQueried],
  );
  const lastUpdatedLabel = useMemo(() => {
    if (!lastSyncedAt) return null;
    const d = new Date(lastSyncedAt);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [lastSyncedAt]);
  const labeledProjects = useMemo(() => {
    const totals = new Map<string, number>();
    for (const row of projects) {
      const project = displayProjectId(row.project);
      if (!project) continue;
      totals.set(project, (totals.get(project) ?? 0) + row.count);
    }
    return [...totals.entries()]
      .map(([project, count]) => ({ project, count }))
      .sort((a, b) => b.count - a.count);
  }, [projects]);
  const projectShare = useMemo(
    () =>
      labeledProjects.slice(0, 6).map((row) => ({
        name: row.project,
        value: row.count,
      })),
    [labeledProjects],
  );
  const calls = useMemo(() => {
    const rows: Array<{ id: string; event_time: string; event_type: string; project: string }> = [];
    for (const row of events) {
      const project = displayProjectId(row.device_id);
      if (!project) continue;
      rows.push({
        id: row.insert_id,
        event_time: row.event_time,
        event_type: row.event_type,
        project,
      });
    }
    return rows;
  }, [events]);
  const totalPages = Math.max(1, Math.ceil(calls.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = calls.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="mb-5 min-w-0">
          <div className="inline-flex max-w-full items-center gap-2 rounded-[2px] border-2 border-foreground bg-card px-3 py-1 text-[10px] font-medium text-foreground sm:text-xs">
            <FontAwesomeIcon icon={faChartLine} className="h-3 w-3 shrink-0 text-[var(--celo-forest)] dark:text-foreground" />
            <span className="uppercase tracking-[0.14em] sm:tracking-[0.18em]">Off-chain · Amplitude</span>
          </div>
          <h2
            className="mt-3 text-xl font-bold tracking-tight break-words sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Off-chain tool calls — reads, lookups & registry queries
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-1 sm:text-xs sm:leading-normal">
            Every Celina read-tool invocation is counted — MCP, apps, the API, and the bot. Wallets queried counts distinct addresses passed into wallet-scoped read tools — not on-chain unique users.
          </p>
          {lastUpdatedLabel && (
            <p className="mt-2 text-xs text-muted-foreground/80 sm:mt-1 sm:text-[11px]">
              Last updated {lastUpdatedLabel} · syncs daily at 00:00 UTC
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Total calls" value={total.toLocaleString()} />
          <KpiCard label="Today" value={agg.today.toLocaleString()} />
          <KpiCard label="Last 7 days" value={agg.last7.toLocaleString()} />
          <KpiCard label="Last 30 days" value={agg.last30.toLocaleString()} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Wallets queried" value={walletsQueried.toLocaleString()} />
          <KpiCard label="Avg / active day" value={agg.avgPerActiveDay.toLocaleString()} />
          <KpiCard label="Peak day" value={agg.peakDay?.count.toLocaleString() ?? "—"} />
          <KpiCard label="Projects" value={labeledProjects.length.toLocaleString()} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Cumulative tool calls" subtitle="last 90 days">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={agg.daily} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} interval={Math.max(0, Math.floor(agg.daily.length / 8))} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ stroke: "var(--border)" }} />
                <Line type="monotone" dataKey="cumulative" name="Cumulative" stroke={lineStroke} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: lineStroke }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Daily tool calls" subtitle="per day">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agg.daily} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} interval={Math.max(0, Math.floor(agg.daily.length / 8))} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Calls" fill={yellow} radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Wallets queried per day" subtitle="distinct addresses">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={queriedWalletsDaily} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} interval={Math.max(0, Math.floor(queriedWalletsDaily.length / 8))} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Queried wallets" fill={forest} radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Calls vs wallets queried" subtitle="volume and reach">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dailyCallsAndQueriedWallets} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} interval={Math.max(0, Math.floor(dailyCallsAndQueriedWallets.length / 8))} />
                <YAxis yAxisId="calls" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <YAxis yAxisId="walletsQueried" orientation="right" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => (
                    <span style={{ color: "var(--foreground)" }}>{value}</span>
                  )}
                />
                <Bar yAxisId="calls" dataKey="calls" name="Calls" fill={yellow} radius={[0, 0, 0, 0]} />
                <Line yAxisId="walletsQueried" type="monotone" dataKey="walletsQueried" name="Wallets queried" stroke={lineStroke} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top tools" subtitle="event · calls">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={agg.topTools}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="event" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={170} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Calls" radius={[0, 0, 0, 0]}>
                  {agg.topTools.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? yellow : forest} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Tool leaderboard" subtitle="top 10 · all time">
            <div className="h-full overflow-auto">
              {agg.topTools.length === 0 && !loading ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No events yet.
                </div>
              ) : (
                <ol className="space-y-2 text-sm">
                  {agg.topTools.map((t, i) => (
                    <li
                      key={t.event}
                      className="flex items-center justify-between gap-3 rounded-[2px] border-2 border-foreground bg-background px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] border-2 border-foreground bg-muted text-[10px] font-semibold text-foreground/80">
                          {i + 1}
                        </span>
                        <span className="truncate font-mono text-xs text-foreground/90">
                          {t.event}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {t.count.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </ChartCard>

          <ChartCard title="Daily calls + 7-day rolling avg" subtitle="trend">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={agg.daily} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} interval={Math.max(0, Math.floor(agg.daily.length / 8))} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => (
                    <span style={{ color: "var(--foreground)" }}>{value}</span>
                  )}
                />
                <Bar dataKey="count" name="Calls" fill={yellow} radius={[0, 0, 0, 0]} />
                <Line type="monotone" dataKey="rolling7" name="7-day rolling average" stroke={lineStroke} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Calls by day of week" subtitle="UTC">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agg.dayOfWeek} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Calls" fill={forest} radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Tool share" subtitle="top 6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => (
                    <span style={{ color: "var(--foreground)" }}>{value}</span>
                  )}
                />
                <Pie
                  data={agg.share}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={48}
                  paddingAngle={2}
                  stroke="var(--background)"
                  strokeWidth={2}
                >
                  {agg.share.map((_, i) => {
                    const palette = [yellow, forest, lineStroke, "var(--muted-foreground)", "var(--border)", "var(--celo-forest)"];
                    return <Cell key={i} fill={palette[i % palette.length]} />;
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Calls by project" subtitle="90 days">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={labeledProjects}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="project" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={140} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Calls" radius={[0, 0, 0, 0]}>
                  {labeledProjects.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? yellow : forest} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Project share" subtitle="top 6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => (
                    <span style={{ color: "var(--foreground)" }}>{value}</span>
                  )}
                />
                <Pie
                  data={projectShare}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={48}
                  paddingAngle={2}
                  stroke="var(--background)"
                  strokeWidth={2}
                >
                  {projectShare.map((_, i) => {
                    const palette = [yellow, forest, lineStroke, "var(--muted-foreground)", "var(--border)", "var(--celo-forest)"];
                    return <Cell key={i} fill={palette[i % palette.length]} />;
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Calls per queried wallet per day" subtitle="wallet-scoped reads only">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyCallsAndQueriedWallets.filter((r) => r.callsPerQueriedWallet != null)}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} interval={Math.max(0, Math.floor(dailyCallsAndQueriedWallets.length / 8))} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ stroke: "var(--border)" }} />
                <Line type="monotone" dataKey="callsPerQueriedWallet" name="Calls / queried wallet" stroke={lineStroke} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: lineStroke }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Calls
          </h2>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {calls.length.toLocaleString()} total
          </span>
        </div>

        <div className="overflow-hidden rounded-[2px] border-2 border-foreground bg-card shadow-[var(--shadow-brutal)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-foreground bg-muted/40 text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <tr>
                  <th className="w-px whitespace-nowrap py-3 pl-3 pr-1 font-medium">#</th>
                  <th className="whitespace-nowrap px-3 py-3 font-medium">When</th>
                  <th className="px-3 py-3 font-medium">Tool</th>
                  <th className="px-3 py-3 font-medium">Project</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                      No calls yet.
                    </td>
                  </tr>
                )}
                {pageRows.map((r, i) => (
                  <tr key={r.id} className="border-b-2 border-foreground/20 last:border-0 hover:bg-muted/30">
                    <td className="w-px whitespace-nowrap py-3 pl-3 pr-1 text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {currentPage * pageSize + i + 1}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-foreground/80">{formatDateTime(r.event_time)}</td>
                    <td className="px-3 py-3 font-mono text-xs text-foreground/80">{r.event_type}</td>
                    <td className="px-3 py-3 font-mono text-xs text-foreground/80">{r.project}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {calls.length > 0 && (
            <div className="flex flex-col gap-3 border-t-2 border-foreground px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, calls.length)} of{" "}
                {calls.length.toLocaleString()} call{calls.length === 1 ? "" : "s"}
                {totalPages > 1 && (
                  <>
                    {" "}
                    · page {currentPage + 1} of {totalPages.toLocaleString()}
                  </>
                )}
              </span>
              {totalPages > 1 && (
                <nav aria-label="Call pages" className="flex flex-wrap items-center gap-1.5">
                  <button type="button" onClick={() => setPage(0)} disabled={currentPage === 0} className={pagerBtnClass}>
                    First
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className={pagerBtnClass}
                  >
                    Prev
                  </button>
                  {pageWindow(currentPage, totalPages).map((item, i) =>
                    item === "ellipsis" ? (
                      <span key={`e-${i}`} className="px-1 text-muted-foreground" aria-hidden>
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPage(item - 1)}
                        aria-label={`Go to page ${item}`}
                        aria-current={item === currentPage + 1 ? "page" : undefined}
                        className={cn(
                          pagerBtnClass,
                          "min-w-8 tabular-nums",
                          item === currentPage + 1 &&
                            "bg-foreground text-background hover:bg-foreground",
                        )}
                      >
                        {item.toLocaleString()}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className={pagerBtnClass}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                    className={pagerBtnClass}
                  >
                    Last
                  </button>
                </nav>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}