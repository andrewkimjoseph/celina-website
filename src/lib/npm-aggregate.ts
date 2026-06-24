import type { NpmDownloadDay } from "./npm.functions";

export const NPM_RANGE_DAYS = 364;

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

export function fmtUtcDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function getNpmRangeStart(end: Date = new Date()): Date {
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - NPM_RANGE_DAYS);
  return start;
}

function formatDateOnly(s: string) {
  if (!s) return "—";
  const d = new Date(`${s}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function isoWeek(d: Date) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** Build contiguous UTC day series; missing days default to 0 downloads. */
export function fillDailyRange(
  rows: NpmDownloadDay[],
  startDay: string,
  endDay: string,
): NpmDownloadDay[] {
  const byDay = new Map(rows.map((r) => [r.day, r.downloads]));
  const filled: NpmDownloadDay[] = [];
  const cur = new Date(`${startDay}T00:00:00Z`);
  const end = new Date(`${endDay}T00:00:00Z`);
  while (cur <= end) {
    const day = fmtUtcDay(cur);
    filled.push({ day, downloads: byDay.get(day) ?? 0 });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return filled;
}

function sumLastDays(filled: NpmDownloadDay[], n: number): number {
  return filled.slice(-n).reduce((s, r) => s + r.downloads, 0);
}

export function aggregateNpm(rows: NpmDownloadDay[], endDay = fmtUtcDay(new Date())): NpmAgg {
  const endDate = new Date(`${endDay}T00:00:00Z`);
  const startDay = fmtUtcDay(getNpmRangeStart(endDate));
  const filled = fillDailyRange(rows, startDay, endDay);

  const total365 = filled.reduce((s, r) => s + r.downloads, 0);
  const last7 = sumLastDays(filled, 7);
  const last30 = sumLastDays(filled, 30);
  const avg30 = Math.round(last30 / 30);

  const daily90 = filled.slice(-90).map((r) => ({
    day: r.day,
    label: formatDateOnly(r.day),
    downloads: r.downloads,
  }));

  let running = 0;
  const cumulative = filled.map((r) => {
    running += r.downloads;
    return { day: r.day, label: formatDateOnly(r.day), total: running };
  });

  const weekMap = new Map<string, number>();
  const monthMap = new Map<string, number>();
  for (const r of filled) {
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
