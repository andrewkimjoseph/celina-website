import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faNpm } from "@fortawesome/free-brands-svg-icons";
import { useNpmStore } from "@/lib/npm-store";
import {
  KpiCard,
  ChartCard,
  aggregateNpm,
  tooltipStyle,
  yellow,
  forest,
  NPM_STAT_URL,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "@/lib/stats-shared";

export const Route = createFileRoute("/stats/package")({
  head: () => ({
    meta: [
      { title: "Celina stats — Package downloads" },
      {
        name: "description",
        content:
          "npm download stats for @andrewkimjoseph/celina — daily, weekly, and monthly adoption.",
      },
      { property: "og:title", content: "Celina stats — Package downloads" },
      {
        property: "og:description",
        content:
          "npm download stats for @andrewkimjoseph/celina — daily, weekly, and monthly adoption.",
      },
    ],
  }),
  component: PackagePage,
});

function PackagePage() {
  const { rows } = useNpmStore();
  const npmAgg = useMemo(() => aggregateNpm(rows), [rows]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--celo-forest)]/40 bg-card/80 px-3 py-1 text-xs font-medium text-foreground">
              <FontAwesomeIcon icon={faNpm} className="h-3.5 w-3.5 text-[var(--celo-forest)] dark:text-foreground" />
              <span className="uppercase tracking-[0.18em]">Package adoption · npm downloads</span>
            </div>
            <h2
              className="mt-3 text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              @andrewkimjoseph/celina downloads
            </h2>
          </div>
          <a
            href={NPM_STAT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            npm-stat.com
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Total (365d)" value={npmAgg.total365.toLocaleString()} />
          <KpiCard label="Last 7 days" value={npmAgg.last7.toLocaleString()} />
          <KpiCard label="Last 30 days" value={npmAgg.last30.toLocaleString()} />
          <KpiCard label="Avg / day (30d)" value={npmAgg.avg30.toLocaleString()} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Daily downloads" subtitle="last 90 days">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={npmAgg.daily90} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} interval={Math.max(0, Math.floor(npmAgg.daily90.length / 8))} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="downloads" name="Downloads" fill={yellow} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Cumulative downloads" subtitle="last 365 days">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={npmAgg.cumulative} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} interval={Math.max(0, Math.floor(npmAgg.cumulative.length / 8))} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
                <Line type="monotone" dataKey="total" name="Cumulative" stroke={forest} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: forest }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Weekly downloads" subtitle="ISO weeks">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={npmAgg.weekly} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} interval={Math.max(0, Math.floor(npmAgg.weekly.length / 8))} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="downloads" name="Downloads" fill={forest} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monthly downloads" subtitle="rolling year">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={npmAgg.monthly} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="downloads" name="Downloads" fill={yellow} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>
    </>
  );
}