import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { useAmplitudeStore } from "@/lib/amplitude-store";
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
          "Live off-chain Celina MCP tool-call stats — read tools, lookups, and registry queries logged to Amplitude.",
      },
      { property: "og:title", content: "Celina stats — Off-chain tool calls" },
      {
        property: "og:description",
        content:
          "Live off-chain Celina MCP tool-call stats — read tools, lookups, and registry queries logged to Amplitude.",
      },
    ],
  }),
  component: OffchainPage,
});

function OffchainPage() {
  const { daily, perTool, loading } = useAmplitudeStore();
  const agg = useMemo(() => aggregateAmplitude(daily, perTool), [daily, perTool]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--celo-forest)]/40 bg-card/80 px-3 py-1 text-xs font-medium text-foreground">
            <FontAwesomeIcon icon={faChartLine} className="h-3 w-3 text-[var(--celo-forest)] dark:text-foreground" />
            <span className="uppercase tracking-[0.18em]">Off-chain · Amplitude</span>
          </div>
          <h2
            className="mt-3 text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MCP tool calls — reads, lookups & registry queries
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Every time an LLM invokes a Celina tool that does not touch the chain, it&apos;s logged to Amplitude. This is the rollup.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Total calls (365d)" value={agg.total.toLocaleString()} />
          <KpiCard label="Today" value={agg.today.toLocaleString()} />
          <KpiCard label="Last 7 days" value={agg.last7.toLocaleString()} />
          <KpiCard label="Last 30 days" value={agg.last30.toLocaleString()} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Active days" value={agg.activeDays.toLocaleString()} />
          <KpiCard label="Avg / active day" value={agg.avgPerActiveDay.toLocaleString()} />
          <KpiCard label="Peak day" value={agg.peakDay?.count.toLocaleString() ?? "—"} />
          <KpiCard label="Unique tools" value={agg.topTools.length.toLocaleString()} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Cumulative tool calls" subtitle="365 days">
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
                <Bar dataKey="count" name="Calls" fill={yellow} radius={[4, 4, 0, 0]} />
              </BarChart>
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
                <Bar dataKey="count" name="Calls" radius={[0, 4, 4, 0]}>
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
                      className="flex items-center justify-between gap-3 rounded-lg border border-foreground/10 bg-background/60 px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground/80">
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
                <Bar dataKey="count" name="Calls" fill={yellow} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="rolling7" name="7d avg" stroke={lineStroke} strokeWidth={2} dot={false} />
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
                <Bar dataKey="count" name="Calls" fill={forest} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Tool share" subtitle="top 6 + other">
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
                >
                  {agg.share.map((_, i) => {
                    const palette = [yellow, forest, "var(--celo-forest)", lineStroke, "var(--muted-foreground)", "var(--celo-yellow)", "var(--border)"];
                    return <Cell key={i} fill={palette[i % palette.length]} />;
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Last 14 days" subtitle="recent activity">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agg.daily.slice(-14)} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Calls" fill={yellow} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>
    </>
  );
}