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
  dailyWalletsQueried: AmplitudeEventDay[];
  perTool: AmplitudeEventTotal[];
  total: number;
  uniqueDevices: number;
  walletsQueried: number;
  fetchedAt: number;
  lastSyncedAt: string | null;
  error: string | null;
};

const LOOKBACK_DAYS = 90;
const CACHE_GATE_MS = 5 * 60 * 1000;
const SYNC_ATTEMPT_GATE_MS = 5 * 60 * 1000;
const EXPORT_CHUNK_HOURS = 6;
const EXPORT_MAX_RETRIES = 2;
const SYNC_FLOOR_ISO = "2026-06-01T00:00:00Z";
const MAX_UNZIPPED_BYTES = 50 * 1024 * 1024;

/** Throttle export attempts so repeated 524s do not run on every page refresh. */
let lastSyncAttemptMs = 0;

function ymdh(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  return `${y}${m}${day}T${h}`;
}

function parseYmdh(hour: string): Date {
  const [datePart, hourPart] = hour.split("T");
  return new Date(
    `${datePart.slice(0, 4)}-${datePart.slice(4, 6)}-${datePart.slice(6, 8)}T${hourPart}:00:00.000Z`,
  );
}

function* exportHourChunks(
  startHour: string,
  endHour: string,
  chunkHours = EXPORT_CHUNK_HOURS,
): Generator<[string, string]> {
  let cur = parseYmdh(startHour);
  const end = parseYmdh(endHour);
  while (cur <= end) {
    const chunkEnd = new Date(cur.getTime() + (chunkHours - 1) * 60 * 60 * 1000);
    const actualEnd = chunkEnd > end ? end : chunkEnd;
    yield [ymdh(cur), ymdh(actualEnd)];
    cur = new Date(actualEnd.getTime() + 60 * 60 * 1000);
  }
}

function isRetryableExportStatus(status: number): boolean {
  return status === 524 || status === 502 || status === 503 || status === 429;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function sbRpcScalar(name: string, body: Record<string, unknown>): Promise<number> {
  const res = await sbFetch(`/rest/v1/rpc/${name}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(
      `Supabase rpc ${name} ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  const value = await res.json();
  return Number(value ?? 0);
}

// ---------------------------------------------------------------------------
// Sync state
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Amplitude Export pull
// ---------------------------------------------------------------------------

type RawEvent = { event_type?: string; event_time?: string };
type RawEventFull = RawEvent & {
  $insert_id?: string;
  insert_id?: string;
  user_id?: string | null;
  device_id?: string | null;
  session_id?: number | null;
  amplitude_id?: number | null;
  app?: string | null;
  platform?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  os_name?: string | null;
  device_family?: string | null;
  library?: string | null;
  event_properties?: Record<string, unknown> | null;
  user_properties?: Record<string, unknown> | null;
};

async function pullExportOnce(startHour: string, endHour: string): Promise<RawEventFull[]> {
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
    const err = new Error(
      `Amplitude export ${res.status}: ${res.statusText} ${body.slice(0, 200)}`,
    );
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  const buf = new Uint8Array(await res.arrayBuffer());
  const entries = unzipSync(buf);
  const events: RawEventFull[] = [];
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
        events.push(JSON.parse(trimmed) as RawEventFull);
      } catch {
        // skip malformed line
      }
    }
  }
  return events;
}

async function pullExport(startHour: string, endHour: string): Promise<RawEventFull[]> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= EXPORT_MAX_RETRIES; attempt++) {
    try {
      return await pullExportOnce(startHour, endHour);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error("Amplitude export failed");
      const status = (lastError as Error & { status?: number }).status;
      if (
        attempt === EXPORT_MAX_RETRIES ||
        status === undefined ||
        !isRetryableExportStatus(status)
      ) {
        throw lastError;
      }
      await sleep(1000 * (attempt + 1));
    }
  }
  throw lastError ?? new Error("Amplitude export failed");
}

async function pullExportRange(startHour: string, endHour: string): Promise<RawEventFull[]> {
  const chunks = [...exportHourChunks(startHour, endHour)];
  if (chunks.length === 0 && startHour <= endHour) {
    throw new Error(`Invalid Amplitude export window ${startHour}..${endHour} (no hour chunks)`);
  }
  const events: RawEventFull[] = [];
  for (const [chunkStart, chunkEnd] of chunks) {
    events.push(...(await pullExport(chunkStart, chunkEnd)));
  }
  return events;
}

function eventTimeToIso(eventTime: string): string | null {
  if (!eventTime) return null;
  // Amplitude format: "YYYY-MM-DD HH:MM:SS.sss" (project tz, treat as UTC)
  const normalized = eventTime.replace(" ", "T") + (eventTime.endsWith("Z") ? "" : "Z");
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function toEventRows(events: RawEventFull[]) {
  const rows: Array<Record<string, unknown>> = [];
  const seen = new Set<string>();
  for (const ev of events) {
    const insert_id = ev.$insert_id ?? ev.insert_id;
    const iso = eventTimeToIso(ev.event_time ?? "");
    if (!insert_id || !iso || !ev.event_type) continue;
    if (seen.has(insert_id)) continue;
    seen.add(insert_id);
    rows.push({
      insert_id,
      event_time: iso,
      event_type: ev.event_type,
      user_id: ev.user_id ?? null,
      device_id: ev.device_id ?? null,
      session_id: ev.session_id ?? null,
      amplitude_id: ev.amplitude_id ?? null,
      app: ev.app ?? null,
      platform: ev.platform ?? null,
      country: ev.country ?? null,
      region: ev.region ?? null,
      city: ev.city ?? null,
      os_name: ev.os_name ?? null,
      device_family: ev.device_family ?? null,
      library: ev.library ?? null,
      event_properties: ev.event_properties ?? null,
      user_properties: ev.user_properties ?? null,
      raw: ev,
    });
  }
  return rows;
}

async function upsertEvents(rows: Array<Record<string, unknown>>): Promise<void> {
  if (rows.length === 0) return;
  const CHUNK = 500;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const res = await sbFetch(
      "/rest/v1/amplitude_events?on_conflict=insert_id",
      {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(chunk),
      },
    );
    if (!res.ok) {
      throw new Error(
        `Supabase upsert amplitude_events ${res.status}: ${(await res.text()).slice(0, 200)}`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Sync orchestration
// ---------------------------------------------------------------------------

export async function syncAmplitudeExport(): Promise<void> {
  const nowMs = Date.now();
  if (nowMs - lastSyncAttemptMs < SYNC_ATTEMPT_GATE_MS) {
    return;
  }

  const { last_synced_at } = await getSyncState();
  const lastSynced = new Date(last_synced_at);
  const now = new Date(nowMs);
  if (now.getTime() - lastSynced.getTime() < CACHE_GATE_MS) {
    return; // cache gate
  }

  lastSyncAttemptMs = nowMs;

  // Always re-pull from the start of YESTERDAY (UTC) to capture late-arriving
  // events and ensure the midnight cron picks up the full previous day. If
  // `lastSynced` is older, start from there instead so we don't skip a gap.
  const yesterdayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1),
  );
  const start = lastSynced < yesterdayStart ? lastSynced : yesterdayStart;
  // Amplitude Export is hour-bucketed and inclusive on both ends.
  const startHour = ymdh(start);
  // End at previous hour to avoid in-progress hour returning 404.
  const endRef = new Date(now.getTime() - 60 * 60 * 1000);
  const endHour = ymdh(endRef);
  if (endHour < startHour) {
    await setSyncState(now.toISOString());
    return;
  }

  const events = await pullExportRange(startHour, endHour);
  const rows = toEventRows(events);
  await upsertEvents(rows);

  await setSyncState(now.toISOString());
}

export const getAmplitudeStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<AmplitudeStatsResult> => {
    if (!process.env.AMPLITUDE_API_KEY || !process.env.AMPLITUDE_SECRET_KEY) {
      return {
        daily: [],
        dailyWalletsQueried: [],
        perTool: [],
        total: 0,
        uniqueDevices: 0,
        walletsQueried: 0,
        fetchedAt: Date.now(),
        lastSyncedAt: null,
        error: "Missing AMPLITUDE_API_KEY / AMPLITUDE_SECRET_KEY",
      };
    }
    if (!process.env.CUSTOM_SUPABASE_URL || !process.env.CUSTOM_SUPABASE_SERVICE_ROLE_KEY) {
      return {
        daily: [],
        dailyWalletsQueried: [],
        perTool: [],
        total: 0,
        uniqueDevices: 0,
        walletsQueried: 0,
        fetchedAt: Date.now(),
        lastSyncedAt: null,
        error: "Missing CUSTOM_SUPABASE_URL / CUSTOM_SUPABASE_SERVICE_ROLE_KEY",
      };
    }

    try {
      const since = new Date();
      since.setUTCDate(since.getUTCDate() - LOOKBACK_DAYS);
      const sinceDay = since.toISOString().slice(0, 10);

      const [dailyRes, toolRes, stateRes, walletsDailyRes] = await Promise.all([
        sbFetch(
          `/rest/v1/amplitude_daily_totals?select=day,count&day=gte.${sinceDay}&order=day.asc`,
        ),
        sbFetch(
          `/rest/v1/amplitude_tool_totals?select=event,count&order=count.desc`,
        ),
        sbFetch(
          `/rest/v1/amplitude_sync_state?select=last_synced_at&id=eq.1`,
        ),
        sbFetch(
          `/rest/v1/amplitude_daily_queried_wallets?select=day,count&day=gte.${sinceDay}&order=day.asc`,
        ),
      ]);
      if (!dailyRes.ok) {
        throw new Error(
          `Supabase read daily_totals ${dailyRes.status}: ${(await dailyRes.text()).slice(0, 200)}`,
        );
      }
      if (!toolRes.ok) {
        throw new Error(
          `Supabase read tool_totals ${toolRes.status}: ${(await toolRes.text()).slice(0, 200)}`,
        );
      }
      if (!walletsDailyRes.ok) {
        throw new Error(
          `Supabase read daily_queried_wallets ${walletsDailyRes.status}: ${(await walletsDailyRes.text()).slice(0, 200)}`,
        );
      }
      const dailyRows = (await dailyRes.json()) as Array<{ day: string; count: number }>;
      const toolRows = (await toolRes.json()) as Array<{ event: string; count: number }>;
      const walletDailyRows = (await walletsDailyRes.json()) as Array<{
        day: string;
        count: number;
      }>;
      let lastSyncedAt: string | null = null;
      if (stateRes.ok) {
        const stateRows = (await stateRes.json()) as Array<{ last_synced_at: string }>;
        lastSyncedAt = stateRows[0]?.last_synced_at ?? null;
      }

      const daily: AmplitudeEventDay[] = dailyRows.map((r) => ({ day: r.day, count: r.count }));
      const perTool: AmplitudeEventTotal[] = toolRows.map((r) => ({ event: r.event, count: r.count }));
      const dailyWalletsQueried: AmplitudeEventDay[] = walletDailyRows.map((r) => ({
        day: r.day,
        count: r.count,
      }));
      const total = daily.reduce((s, d) => s + d.count, 0);
      const [uniqueDevices, walletsQueried] = await Promise.all([
        sbRpcScalar("amplitude_unique_device_count", { since_day: sinceDay }),
        sbRpcScalar("amplitude_wallets_queried_total", { since_day: sinceDay }),
      ]);

      return {
        daily,
        dailyWalletsQueried,
        perTool,
        total,
        uniqueDevices,
        walletsQueried,
        fetchedAt: Date.now(),
        lastSyncedAt,
        error: null,
      };
    } catch (e) {
      return {
        daily: [],
        dailyWalletsQueried: [],
        perTool: [],
        total: 0,
        uniqueDevices: 0,
        walletsQueried: 0,
        fetchedAt: Date.now(),
        lastSyncedAt: null,
        error: e instanceof Error ? e.message : "Failed to read cached stats",
      };
    }
  },
);