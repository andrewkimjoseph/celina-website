import { createServerFn } from "@tanstack/react-start";
import { unzipSync, gunzipSync, strFromU8 } from "fflate";

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

const LOOKBACK_DAYS = 90;
const CACHE_GATE_MS = 5 * 60 * 1000;
const SYNC_FLOOR_ISO = "2026-06-01T00:00:00Z";
const MAX_UNZIPPED_BYTES = 50 * 1024 * 1024;

function ymdh(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  return `${y}${m}${day}T${h}`;
}

function isoDayFromEventTime(eventTime: string): string | null {
  // Amplitude event_time is "YYYY-MM-DD HH:MM:SS.sss" in project timezone,
  // but for our purposes we just take the date portion.
  if (!eventTime || eventTime.length < 10) return null;
  return eventTime.slice(0, 10);
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

// ---------------------------------------------------------------------------
// Custom Supabase REST helpers (uses CUSTOM_SUPABASE_URL + service role key)
// ---------------------------------------------------------------------------

function supabaseConfig() {
  const url = process.env.CUSTOM_SUPABASE_URL;
  const key = process.env.CUSTOM_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing CUSTOM_SUPABASE_URL or CUSTOM_SUPABASE_SERVICE_ROLE_KEY");
  return { url: url.replace(/\/+$/, ""), key };
}

async function sbFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const { url, key } = supabaseConfig();
  const res = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  return res;
}

async function getSyncState(): Promise<{ last_synced_at: string }> {
  const res = await sbFetch(
    "/rest/v1/amplitude_sync_state?select=last_synced_at&id=eq.1",
  );
  if (!res.ok) {
    throw new Error(
      `Supabase get sync_state ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  const rows = (await res.json()) as Array<{ last_synced_at: string }>;
  if (rows.length === 0) {
    // Seed the row.
    const seed = await sbFetch("/rest/v1/amplitude_sync_state", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ id: 1, last_synced_at: SYNC_FLOOR_ISO }),
    });
    if (!seed.ok) {
      throw new Error(
        `Supabase seed sync_state ${seed.status}: ${(await seed.text()).slice(0, 200)}`,
      );
    }
    return { last_synced_at: SYNC_FLOOR_ISO };
  }
  return rows[0];
}

async function setSyncState(iso: string): Promise<void> {
  const res = await sbFetch("/rest/v1/amplitude_sync_state?id=eq.1", {
    method: "PATCH",
    body: JSON.stringify({ last_synced_at: iso, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    throw new Error(
      `Supabase update sync_state ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
}

async function upsertDailyCounts(
  rows: Array<{ day: string; event_type: string; count: number }>,
): Promise<void> {
  if (rows.length === 0) return;
  // PostgREST upsert via Prefer: resolution=merge-duplicates on the composite PK.
  const res = await sbFetch(
    "/rest/v1/amplitude_daily_event_counts?on_conflict=day,event_type",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(rows),
    },
  );
  if (!res.ok) {
    throw new Error(
      `Supabase upsert daily_counts ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
}

async function readDailyCounts(sinceIsoDay: string): Promise<
  Array<{ day: string; event_type: string; count: number }>
> {
  const res = await sbFetch(
    `/rest/v1/amplitude_daily_event_counts?select=day,event_type,count&day=gte.${sinceIsoDay}&order=day.asc`,
  );
  if (!res.ok) {
    throw new Error(
      `Supabase read daily_counts ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  return (await res.json()) as Array<{ day: string; event_type: string; count: number }>;
}

// ---------------------------------------------------------------------------
// Amplitude Export pull
// ---------------------------------------------------------------------------

type RawEvent = { event_type?: string; event_time?: string };

async function pullExport(startHour: string, endHour: string): Promise<RawEvent[]> {
  const url = new URL(`${baseUrl()}/api/2/export`);
  url.searchParams.set("start", startHour);
  url.searchParams.set("end", endHour);

  const res = await fetch(url.toString(), {
    headers: { Authorization: authHeader() },
  });
  if (res.status === 404) {
    // No data in this window.
    return [];
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Amplitude export ${res.status}: ${res.statusText} ${body.slice(0, 200)}`,
    );
  }
  const buf = new Uint8Array(await res.arrayBuffer());
  const entries = unzipSync(buf);
  const events: RawEvent[] = [];
  let totalBytes = 0;
  for (const [name, gzipped] of Object.entries(entries)) {
    if (!name.endsWith(".gz") && !name.endsWith(".json.gz")) continue;
    const ndjsonBytes = gunzipSync(gzipped);
    totalBytes += ndjsonBytes.length;
    if (totalBytes > MAX_UNZIPPED_BYTES) {
      throw new Error(
        `Amplitude export payload exceeds ${MAX_UNZIPPED_BYTES} bytes (got ${totalBytes}); aborting`,
      );
    }
    const text = strFromU8(ndjsonBytes);
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        events.push(JSON.parse(trimmed) as RawEvent);
      } catch {
        // skip malformed line
      }
    }
  }
  return events;
}

function bucketEvents(events: RawEvent[]): Map<string, Map<string, number>> {
  // day -> event_type -> count
  const byDay = new Map<string, Map<string, number>>();
  for (const ev of events) {
    const day = isoDayFromEventTime(ev.event_time ?? "");
    const type = ev.event_type;
    if (!day || !type) continue;
    let inner = byDay.get(day);
    if (!inner) {
      inner = new Map();
      byDay.set(day, inner);
    }
    inner.set(type, (inner.get(type) ?? 0) + 1);
  }
  return byDay;
}

// ---------------------------------------------------------------------------
// Sync orchestration
// ---------------------------------------------------------------------------

async function syncAmplitudeExport(): Promise<void> {
  const { last_synced_at } = await getSyncState();
  const lastSynced = new Date(last_synced_at);
  const now = new Date();
  if (now.getTime() - lastSynced.getTime() < CACHE_GATE_MS) {
    return; // cache gate
  }

  // Always re-pull from start of the current UTC day to capture late-arriving
  // events. Floor `lastSynced` to that boundary when it's earlier.
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const start = lastSynced < todayStart ? lastSynced : todayStart;
  // Amplitude Export is hour-bucketed and inclusive on both ends.
  const startHour = ymdh(start);
  // End at previous hour to avoid in-progress hour returning 404.
  const endRef = new Date(now.getTime() - 60 * 60 * 1000);
  const endHour = ymdh(endRef);
  if (endHour < startHour) {
    await setSyncState(now.toISOString());
    return;
  }

  const events = await pullExport(startHour, endHour);
  const byDay = bucketEvents(events);

  // For each day touched in this pull, we must clear+rewrite the day's rows
  // to keep counts accurate (we may have re-pulled hours we already counted).
  // Strategy: delete touched days, then insert fresh totals. To stay atomic-ish,
  // we read existing rows for days BEFORE today only if we expand the range
  // beyond today — but the rule above keeps us at >= today most of the time.
  const days = Array.from(byDay.keys());
  if (days.length > 0) {
    const inList = days.map((d) => `"${d}"`).join(",");
    const del = await sbFetch(
      `/rest/v1/amplitude_daily_event_counts?day=in.(${inList})`,
      { method: "DELETE", headers: { Prefer: "return=minimal" } },
    );
    if (!del.ok) {
      throw new Error(
        `Supabase delete daily_counts ${del.status}: ${(await del.text()).slice(0, 200)}`,
      );
    }
    const rows: Array<{ day: string; event_type: string; count: number }> = [];
    for (const [day, inner] of byDay.entries()) {
      for (const [event_type, count] of inner.entries()) {
        rows.push({ day, event_type, count });
      }
    }
    await upsertDailyCounts(rows);
  }

  await setSyncState(now.toISOString());
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
    if (!process.env.CUSTOM_SUPABASE_URL || !process.env.CUSTOM_SUPABASE_SERVICE_ROLE_KEY) {
      return {
        daily: [],
        perTool: [],
        total: 0,
        fetchedAt: Date.now(),
        error: "Missing CUSTOM_SUPABASE_URL / CUSTOM_SUPABASE_SERVICE_ROLE_KEY",
      };
    }

    let syncError: string | null = null;
    try {
      await syncAmplitudeExport();
    } catch (e) {
      syncError = e instanceof Error ? e.message : "Sync failed";
      // Continue — we can still serve cached rows.
    }

    try {
      const since = new Date();
      since.setUTCDate(since.getUTCDate() - LOOKBACK_DAYS);
      const sinceDay = since.toISOString().slice(0, 10);
      const rows = await readDailyCounts(sinceDay);

      const dayTotals = new Map<string, number>();
      const toolTotals = new Map<string, number>();
      for (const r of rows) {
        dayTotals.set(r.day, (dayTotals.get(r.day) ?? 0) + r.count);
        toolTotals.set(r.event_type, (toolTotals.get(r.event_type) ?? 0) + r.count);
      }
      const daily: AmplitudeEventDay[] = Array.from(dayTotals.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, count]) => ({ day, count }));
      const perTool: AmplitudeEventTotal[] = Array.from(toolTotals.entries())
        .map(([event, count]) => ({ event, count }))
        .sort((a, b) => b.count - a.count);
      const total = daily.reduce((s, d) => s + d.count, 0);

      return { daily, perTool, total, fetchedAt: Date.now(), error: syncError };
    } catch (e) {
      return {
        daily: [],
        perTool: [],
        total: 0,
        fetchedAt: Date.now(),
        error: e instanceof Error ? e.message : "Failed to read cached stats",
      };
    }
  },
);