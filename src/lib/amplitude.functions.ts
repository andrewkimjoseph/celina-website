import { createServerFn } from "@tanstack/react-start";

export type AmplitudeEventDay = {
  day: string; // YYYY-MM-DD
  count: number;
};

export type AmplitudeEventTotal = {
  event: string;
  count: number;
};

export type AmplitudeStatsResult = {
  daily: AmplitudeEventDay[];
  perTool: AmplitudeEventTotal[];
  total: number;
  fetchedAt: number;
  error: string | null;
};

const LOOKBACK_DAYS = 365;
const BATCH_SIZE = 10;

function ymd(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function isoDay(yyyymmdd: string): string {
  // Amplitude xValues already come as YYYY-MM-DD
  return yyyymmdd;
}

function baseUrl(): string {
  const region = (process.env.AMPLITUDE_REGION ?? "us").toLowerCase();
  return region === "eu"
    ? "https://analytics.eu.amplitude.com"
    : "https://amplitude.com";
}

function authHeader(): string {
  const key = process.env.AMPLITUDE_API_KEY!;
  const secret = process.env.AMPLITUDE_SECRET_KEY!;
  const token = Buffer.from(`${key}:${secret}`).toString("base64");
  return `Basic ${token}`;
}

type SegmentationResponse = {
  data?: {
    series?: number[][]; // [eventIndex][bucketIndex]
    seriesLabels?: string[];
    xValues?: string[]; // YYYY-MM-DD
  };
};

async function segmentation(
  events: { event_type: string }[],
  start: string,
  end: string,
): Promise<SegmentationResponse> {
  const url = new URL(`${baseUrl()}/api/2/events/segmentation`);
  // Amplitude expects one `e=` param per event (repeated), NOT a JSON array.
  for (const ev of events) {
    url.searchParams.append("e", JSON.stringify(ev));
  }
  url.searchParams.set("start", start);
  url.searchParams.set("end", end);
  url.searchParams.set("i", "1"); // daily buckets
  url.searchParams.set("m", "totals");

  const res = await fetch(url.toString(), {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Amplitude segmentation ${res.status}: ${res.statusText} ${body.slice(0, 200)}`,
    );
  }
  return (await res.json()) as SegmentationResponse;
}

type EventsListResponse = {
  data?: Array<{ name?: string; value?: string; non_active?: boolean; hidden?: boolean }>;
};

async function listEvents(): Promise<string[]> {
  const res = await fetch(`${baseUrl()}/api/2/events/list`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Amplitude events/list ${res.status}: ${res.statusText} ${body.slice(0, 200)}`,
    );
  }
  const json = (await res.json()) as EventsListResponse;
  const out: string[] = [];
  for (const e of json.data ?? []) {
    if (e.hidden) continue;
    const name = e.value ?? e.name;
    if (!name) continue;
    if (name.startsWith("[Amplitude]")) continue;
    out.push(name);
  }
  return out;
}

export const getAmplitudeStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<AmplitudeStatsResult> => {
    if (!process.env.AMPLITUDE_API_KEY || !process.env.AMPLITUDE_SECRET_KEY) {
      return {
        daily: [],
        perTool: [],
        total: 0,
        fetchedAt: Date.now(),
        error: "Missing AMPLITUDE_API_KEY / AMPLITUDE_SECRET_KEY",
      };
    }

    const end = new Date();
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - LOOKBACK_DAYS);
    const startStr = ymd(start);
    const endStr = ymd(end);

    try {
      const events = await listEvents();
      if (events.length === 0) {
        return {
          daily: [],
          perTool: [],
          total: 0,
          fetchedAt: Date.now(),
          error: null,
        };
      }

      // Aggregate by day across all events + per-event totals.
      const dayTotals = new Map<string, number>();
      const perTool: AmplitudeEventTotal[] = [];

      for (let i = 0; i < events.length; i += BATCH_SIZE) {
        const chunk = events.slice(i, i + BATCH_SIZE);
        const resp = await segmentation(
          chunk.map((event_type) => ({ event_type })),
          startStr,
          endStr,
        );
        const series = resp.data?.series ?? [];
        const xValues = resp.data?.xValues ?? [];
        series.forEach((rowCounts, idx) => {
          // seriesLabels returns group-by indices (e.g. "0"), not event names.
          // Use our requested event name instead.
          const name = String(chunk[idx] ?? `event_${idx}`);
          let toolTotal = 0;
          rowCounts.forEach((c, j) => {
            const day = isoDay(xValues[j] ?? "");
            if (!day) return;
            const n = Number(c) || 0;
            toolTotal += n;
            dayTotals.set(day, (dayTotals.get(day) ?? 0) + n);
          });
          if (toolTotal > 0) perTool.push({ event: name, count: toolTotal });
        });
      }

      const daily: AmplitudeEventDay[] = Array.from(dayTotals.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, count]) => ({ day, count }));

      perTool.sort((a, b) => b.count - a.count);
      const total = daily.reduce((s, d) => s + d.count, 0);

      return { daily, perTool, total, fetchedAt: Date.now(), error: null };
    } catch (e) {
      return {
        daily: [],
        perTool: [],
        total: 0,
        fetchedAt: Date.now(),
        error: e instanceof Error ? e.message : "Failed to fetch Amplitude stats",
      };
    }
  },
);