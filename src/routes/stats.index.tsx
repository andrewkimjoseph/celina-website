import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faNpm } from "@fortawesome/free-brands-svg-icons";
import { useStatsStore } from "@/lib/stats-store";
import { useNpmStore } from "@/lib/npm-store";
import { useNpmHydrated } from "@/lib/use-persist-hydrated";
import { useAmplitudeStore } from "@/lib/amplitude-store";
import {
  KpiCard,
  KpiSkeleton,
  aggregate,
  aggregateNpm,
  aggregateAmplitude,
  tooltipStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
  yellow,
  lineStroke,
  forest,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "@/lib/stats-shared";

export const Route = createFileRoute("/stats/")({
  head: () => ({
    meta: [
      { title: "Celina stats — Overview" },
      { name: "description", content: "Overview of Celina on-chain activity and npm package adoption." },
    ],
  }),
  component: OverviewPage,
});

function SectionCard({
  to,
  badge,
  title,
  description,
  children,
}: {
  to: string;
  badge: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-card p-6 shadow-[var(--shadow-soft)] transition hover:border-[var(--celo-yellow)]"
    >
      <div className="flex items-center justify-between gap-3">
        {badge}
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition group-hover:text-foreground">
          Explore <FontAwesomeIcon icon={faArrowRight} className="h-2.5 w-2.5" />
        </span>
      </div>
      <div>
        <h3
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="h-40 w-full">{children}</div>
    </Link>
  );
}

function OverviewPage() {
  const { rows } = useStatsStore();
  const { rows: npmRows } = useNpmStore();
  const npmHydrated = useNpmHydrated();
  const { daily: ampDaily, perTool: ampPerTool, walletsQueried } = useAmplitudeStore();
  const agg = useMemo(() => aggregate(rows), [rows]);
  const npmAgg = useMemo(() => aggregateNpm(npmRows), [npmRows]);
  const ampAgg = useMemo(
    () => aggregateAmplitude(ampDaily, ampPerTool),
    [ampDaily, ampPerTool],
  );

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          <KpiCard label="On-chain total" value={agg.totalTx.toLocaleString()} />
          <KpiCard label="On-chain today" value={agg.todayCount.toLocaleString()} />
          <KpiCard label="Off-chain total" value={ampAgg.total.toLocaleString()} />
          <KpiCard label="Off-chain 7d" value={ampAgg.last7.toLocaleString()} />
          <KpiCard label="Wallets queried" value={walletsQueried.toLocaleString()} />
          {npmHydrated ? (
            <>
              <KpiCard label="npm 365d" value={npmAgg.total365.toLocaleString()} />
              <KpiCard label="npm last 7d" value={npmAgg.last7.toLocaleString()} />
            </>
          ) : (
            <>
              <KpiSkeleton />
              <KpiSkeleton />
            </>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard
            to="/stats/onchain"
            badge={
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--celo-forest)]/40 bg-card/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground">
                On-chain · Dune
              </span>
            }
            title="On-chain activity"
            description="Every Celo mainnet transaction tagged CELINA — volume, hourly cadence, and top counterparties."
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={agg.daily} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} hide />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ stroke: "var(--border)" }} />
                <Line type="monotone" dataKey="cumulative" stroke={lineStroke} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard
            to="/stats/offchain"
            badge={
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--celo-forest)]/40 bg-card/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground">
                Off-chain · Amplitude
              </span>
            }
            title="MCP tool calls"
            description="Reads, registry lookups, and other non-chain tool invocations from LLMs — logged to Amplitude."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ampAgg.daily.slice(-90)} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} hide />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" fill={yellow} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard
            to="/stats/package"
            badge={
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--celo-forest)]/40 bg-card/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground">
                <FontAwesomeIcon icon={faNpm} className="h-3 w-3 text-foreground dark:text-[var(--celo-yellow)]" />
                npm downloads
              </span>
            }
            title="Package adoption"
            description="Combined daily downloads for celina-mcp, celina-sdk, and the legacy celina wrapper from the npm registry."
          >
            {npmHydrated ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={npmAgg.daily90} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} hide />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={32} />
                  <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="downloads" fill={forest} radius={[3, 3, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-xl bg-muted" />
            )}
          </SectionCard>
        </div>
      </section>

      <ChartCardSpacer />
    </>
  );
}

function ChartCardSpacer() {
  // keeps footer spacing consistent with chart pages
  return <div className="pb-2" />;
}