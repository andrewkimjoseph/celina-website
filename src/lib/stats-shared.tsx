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
import type { CelinaTxRow } from "@/lib/dune.functions";
import type { NpmDownloadDay } from "@/lib/npm.functions";
import type {
  AmplitudeEventDay,
  AmplitudeEventTotal,
} from "@/lib/amplitude.functions";

export const NPM_URL = "https://www.npmjs.com/package/@andrewkimjoseph/celina-mcp";
export const NPM_STAT_URL =
  "https://npm-stat.com/charts.html?package=@andrewkimjoseph/celina-mcp";
export const DUNE_DASHBOARD_URL =
  "https://dune.com/andrewkimjoseph7352/celina";

export { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis };

export const yellow = "var(--celo-yellow)";
export const lineStroke = "var(--chart-line)";
export const forest = "var(--celo-forest)";

export const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--foreground)",
  fontSize: 12,
};

export const tooltipItemStyle = { color: "var(--foreground)" };
export const tooltipLabelStyle = { color: "var(--foreground)", fontWeight: 600 };

export function truncate(addr: string, head = 6, tail = 4) {
  if (!addr) return "";
  if (addr.length <= head + tail + 1) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export function formatDateTime(s: string) {
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

export function formatDateOnly(s: string) {
  if (!s) return "—";
  const d = new Date(s.replace(" UTC", "Z").replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function timeAgo(ts: number | null) {
  if (!ts) return "never";
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export type Aggregates = {
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

export function aggregate(rows: CelinaTxRow[]): Aggregates {
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

export type NpmAgg = {
  total365: number;
  last7: number;
  last30: number;
  avg30: number;
  daily90: Array<{ day: string; label: string; downloads: number }>;
  cumulative: Array<{ day: string; label: string; total: number }>;
  weekly: Array<{ week: string; downloads: number }>;
  monthly: Array<{ month: string; label: string; downloads: number }>;
};

function isoWeek(d: Date) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function aggregateNpm(rows: NpmDownloadDay[]): NpmAgg {
  const sorted = [...rows].sort((a, b) => a.day.localeCompare(b.day));
  const total365 = sorted.reduce((s, r) => s + r.downloads, 0);
  const last7 = sorted.slice(-7).reduce((s, r) => s + r.downloads, 0);
  const last30 = sorted.slice(-30).reduce((s, r) => s + r.downloads, 0);
  const avg30 = sorted.length ? Math.round(last30 / Math.min(30, sorted.length)) : 0;

  const daily90 = sorted.slice(-90).map((r) => ({
    day: r.day,
    label: formatDateOnly(r.day),
    downloads: r.downloads,
  }));

  let running = 0;
  const cumulative = sorted.map((r) => {
    running += r.downloads;
    return { day: r.day, label: formatDateOnly(r.day), total: running };
  });

  const weekMap = new Map<string, number>();
  const monthMap = new Map<string, number>();
  for (const r of sorted) {
    const d = new Date(`${r.day}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) continue;
    const wk = isoWeek(d);
    weekMap.set(wk, (weekMap.get(wk) ?? 0) + r.downloads);
    const mo = r.day.slice(0, 7);
    monthMap.set(mo, (monthMap.get(mo) ?? 0) + r.downloads);
  }
  const weekly = Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, downloads]) => ({ week, downloads }));
  const monthly = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, downloads]) => {
      const [y, m] = month.split("-");
      const dt = new Date(Date.UTC(Number(y), Number(m) - 1, 1));
      return {
        month,
        label: dt.toLocaleDateString(undefined, { month: "short", year: "2-digit" }),
        downloads,
      };
    });

  return { total365, last7, last30, avg30, daily90, cumulative, weekly, monthly };
}

export function ChartCard({
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

export function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
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
      {sub && (
        <div className="mt-1.5 text-[11px] leading-snug text-muted-foreground/80">
          {sub}
        </div>
      )}
    </div>
  );
}

export type AmplitudeAgg = {
  total: number;
  today: number;
  last7: number;
  last30: number;
  daily: Array<{ day: string; label: string; count: number; cumulative: number; rolling7: number }>;
  topTools: Array<{ event: string; count: number }>;
  dayOfWeek: Array<{ name: string; count: number }>;
  share: Array<{ name: string; value: number }>;
  activeDays: number;
  avgPerActiveDay: number;
  peakDay: { day: string; label: string; count: number } | null;
};

export function aggregateAmplitude(
  daily: AmplitudeEventDay[],
  perTool: AmplitudeEventTotal[],
): AmplitudeAgg {
  const sorted = [...daily].sort((a, b) => a.day.localeCompare(b.day));
  let running = 0;
  const dailyOut = sorted.map((r, i) => {
    running += r.count;
    const window = sorted.slice(Math.max(0, i - 6), i + 1);
    const rolling7 = window.reduce((s, x) => s + x.count, 0) / window.length;
    return {
      day: r.day,
      label: formatDateOnly(r.day),
      count: r.count,
      cumulative: running,
      rolling7: Math.round(rolling7 * 10) / 10,
    };
  });
  const total = running;
  const today = sorted[sorted.length - 1]?.count ?? 0;
  const last7 = sorted.slice(-7).reduce((s, r) => s + r.count, 0);
  const last30 = sorted.slice(-30).reduce((s, r) => s + r.count, 0);
  const topTools = [...perTool]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const dowNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dowCounts = [0, 0, 0, 0, 0, 0, 0];
  for (const r of sorted) {
    const d = new Date(`${r.day}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) continue;
    dowCounts[d.getUTCDay()] += r.count;
  }
  const dayOfWeek = dowNames.map((name, i) => ({ name, count: dowCounts[i] }));

  const sortedTools = [...perTool].sort((a, b) => b.count - a.count);
  const topShare = sortedTools.slice(0, 6);
  const restTotal = sortedTools.slice(6).reduce((s, t) => s + t.count, 0);
  const share = [
    ...topShare.map((t) => ({ name: t.event, value: t.count })),
    ...(restTotal > 0 ? [{ name: "Other", value: restTotal }] : []),
  ];

  const activeDays = sorted.filter((r) => r.count > 0).length;
  const avgPerActiveDay = activeDays
    ? Math.round((total / activeDays) * 10) / 10
    : 0;
  const peak = sorted.reduce<{ day: string; count: number } | null>(
    (acc, r) => (!acc || r.count > acc.count ? { day: r.day, count: r.count } : acc),
    null,
  );
  const peakDay = peak
    ? { day: peak.day, label: formatDateOnly(peak.day), count: peak.count }
    : null;

  return {
    total,
    today,
    last7,
    last30,
    daily: dailyOut,
    topTools,
    dayOfWeek,
    share,
    activeDays,
    avgPerActiveDay,
    peakDay,
  };
}