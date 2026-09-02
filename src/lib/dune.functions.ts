import { createServerFn } from "@tanstack/react-start";
import { dayKey } from "./onchain-cumulative.ts";
import { sbFetch } from "./supabase.ts";

export type CelinaTxRow = {
  day: string;
  hash: string;
  block_time: string;
  block_number: number;
  from: string;
  to: string;
};

export type CelinaStatsResult = {
  rows: CelinaTxRow[];
  fetchedAt: number;
  queryExecutedAt: string | null;
  error: string | null;
  queryUrl: string | null;
};

const UNAVAILABLE_MSG = "On-chain stats are temporarily unavailable.";
const UNAVAILABLE_PROVIDER_MSG =
  "On-chain stats are temporarily unavailable (data provider unreachable).";

const DUNE_PAGE_SIZE = 1000;
const DUNE_UPSERT_CHUNK = 500;
const DUNE_POLL_MS = 2000;
const DUNE_POLL_TIMEOUT_MS = 90_000;
const SB_PAGE_SIZE = 1000;

function resolveDuneQueryId(): number | null {
  const raw = process.env.DUNE_QUERY_ID?.trim();
  if (!raw) return null;
  const id = Number.parseInt(raw, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

function duneQueryUrl(id: number): string {
  return `https://dune.com/queries/${id}`;
}

function duneApiKey(): string {
  const key = process.env.DUNE_API_KEY?.trim();
  if (!key) throw new Error("Missing DUNE_API_KEY");
  return key;
}

function unavailableResult(): CelinaStatsResult {
  return {
    rows: [],
    fetchedAt: Date.now(),
    queryExecutedAt: null,
    error: UNAVAILABLE_MSG,
    queryUrl: null,
  };
}

function mapDuneRow(r: Record<string, unknown>): CelinaTxRow | null {
  const hash = String(r.hash ?? "").trim();
  const block_time = String(r.block_time ?? "").trim();
  if (!hash || !block_time) return null;
  const mapped = {
    day: "",
    hash,
    block_time,
    block_number: Number(r.block_number ?? 0),
    from: String(r.from ?? ""),
    to: String(r.to ?? ""),
  };
  mapped.day = dayKey({
    hash,
    block_time,
    day: typeof r.day === "string" ? r.day : undefined,
  });
  if (!mapped.day) return null;
  return mapped;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type DuneSyncState = {
  last_synced_at: string;
  last_execution_ended_at: string | null;
};

async function getDuneSyncState(): Promise<DuneSyncState> {
  const res = await sbFetch(
    "/rest/v1/dune_sync_state?select=last_synced_at,last_execution_ended_at&id=eq.1",
  );
  if (!res.ok) {
    throw new Error(
      `Supabase get dune_sync_state ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  const rows = (await res.json()) as DuneSyncState[];
  if (rows.length === 0) {
    const seed = await sbFetch("/rest/v1/dune_sync_state", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        id: 1,
        last_synced_at: "1970-01-01T00:00:00Z",
        last_execution_ended_at: null,
      }),
    });
    if (!seed.ok) {
      throw new Error(
        `Supabase seed dune_sync_state ${seed.status}: ${(await seed.text()).slice(0, 200)}`,
      );
    }
    return { last_synced_at: "1970-01-01T00:00:00Z", last_execution_ended_at: null };
  }
  return rows[0];
}

async function setDuneSyncState(executionEndedAt: string): Promise<void> {
  const now = new Date().toISOString();
  const res = await sbFetch("/rest/v1/dune_sync_state?id=eq.1", {
    method: "PATCH",
    body: JSON.stringify({
      last_synced_at: now,
      last_execution_ended_at: executionEndedAt,
      updated_at: now,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `Supabase update dune_sync_state ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
}

async function getMaxStoredBlockNumber(): Promise<number | null> {
  const res = await sbFetch(
    "/rest/v1/dune_celina_txns?select=block_number&order=block_number.desc&limit=1",
  );
  if (!res.ok) {
    throw new Error(
      `Supabase max block_number ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  const rows = (await res.json()) as Array<{ block_number: number }>;
  return rows[0]?.block_number ?? null;
}

function postgrestInList(values: string[]): string {
  return values.map((v) => `"${v.replace(/"/g, '\\"')}"`).join(",");
}

async function existingHashes(hashes: string[]): Promise<Set<string>> {
  if (hashes.length === 0) return new Set();
  // PostgREST rejects long `in.(...)` GET URLs (~500×66-char hashes → 400).
  const LOOKUP_CHUNK = 100;
  const known = new Set<string>();
  for (let i = 0; i < hashes.length; i += LOOKUP_CHUNK) {
    const chunk = hashes.slice(i, i + LOOKUP_CHUNK);
    const res = await sbFetch(
      `/rest/v1/dune_celina_txns?select=hash&hash=in.(${postgrestInList(chunk)})`,
    );
    if (!res.ok) {
      throw new Error(
        `Supabase hash lookup ${res.status}: ${(await res.text()).slice(0, 200)}`,
      );
    }
    const rows = (await res.json()) as Array<{ hash: string }>;
    for (const row of rows) known.add(row.hash);
  }
  return known;
}

async function upsertTxnRows(rows: CelinaTxRow[]): Promise<void> {
  if (rows.length === 0) return;
  const now = new Date().toISOString();
  for (let i = 0; i < rows.length; i += DUNE_UPSERT_CHUNK) {
    const chunk = rows.slice(i, i + DUNE_UPSERT_CHUNK).map((r) => ({
      hash: r.hash,
      day: r.day,
      block_time: r.block_time,
      block_number: r.block_number,
      from: r.from,
      to: r.to,
      synced_at: now,
    }));
    const res = await sbFetch("/rest/v1/dune_celina_txns?on_conflict=hash", {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(chunk),
    });
    if (!res.ok) {
      throw new Error(
        `Supabase upsert dune_celina_txns ${res.status}: ${(await res.text()).slice(0, 200)}`,
      );
    }
  }
}

async function executeDuneQuery(queryId: number): Promise<string> {
  const apiKey = duneApiKey();
  const res = await fetch(`https://api.dune.com/api/v1/query/${queryId}/execute`, {
    method: "POST",
    headers: {
      "X-Dune-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    throw new Error(
      `Dune execute ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  const json = (await res.json()) as { execution_id?: string };
  if (!json.execution_id) {
    throw new Error("Dune execute did not return execution_id");
  }
  return json.execution_id;
}

async function pollDuneExecution(executionId: string): Promise<string> {
  const apiKey = duneApiKey();
  const deadline = Date.now() + DUNE_POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const res = await fetch(
      `https://api.dune.com/api/v1/execution/${executionId}/status`,
      { headers: { "X-Dune-API-Key": apiKey } },
    );
    if (!res.ok) {
      throw new Error(
        `Dune status ${res.status}: ${(await res.text()).slice(0, 200)}`,
      );
    }
    const json = (await res.json()) as {
      state?: string;
      execution_ended_at?: string;
    };
    const state = json.state ?? "";
    if (state === "QUERY_STATE_COMPLETED") {
      return typeof json.execution_ended_at === "string"
        ? json.execution_ended_at
        : new Date().toISOString();
    }
    if (
      state === "QUERY_STATE_FAILED" ||
      state === "QUERY_STATE_CANCELLED" ||
      state === "QUERY_STATE_EXPIRED"
    ) {
      throw new Error(`Dune execution ${state}`);
    }
    await sleep(DUNE_POLL_MS);
  }
  throw new Error("Dune execution timed out");
}

async function fetchDuneResultPage(
  queryId: number,
  offset: number,
): Promise<{ rows: CelinaTxRow[]; executionEndedAt: string | null }> {
  const apiKey = duneApiKey();
  const url = new URL(`https://api.dune.com/api/v1/query/${queryId}/results`);
  url.searchParams.set("limit", String(DUNE_PAGE_SIZE));
  url.searchParams.set("offset", String(offset));
  const res = await fetch(url.toString(), {
    headers: { "X-Dune-API-Key": apiKey },
  });
  if (!res.ok) {
    throw new Error(
      `Dune results ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  const json = (await res.json()) as {
    execution_ended_at?: string;
    result?: { rows?: Array<Record<string, unknown>> };
  };
  const rows = (json.result?.rows ?? [])
    .map(mapDuneRow)
    .filter((r): r is CelinaTxRow => r !== null);
  return {
    rows,
    executionEndedAt:
      typeof json.execution_ended_at === "string" ? json.execution_ended_at : null,
  };
}

export async function backfillDuneResults(): Promise<{
  upserted: number;
  executionEndedAt: string;
}> {
  const queryId = resolveDuneQueryId();
  if (queryId === null) {
    throw new Error("Missing or invalid DUNE_QUERY_ID");
  }
  duneApiKey();

  let first = await fetchDuneResultPage(queryId, 0);
  let executionEndedAt = first.executionEndedAt;
  if (first.rows.length === 0 && !executionEndedAt) {
    const executionId = await executeDuneQuery(queryId);
    executionEndedAt = await pollDuneExecution(executionId);
    first = await fetchDuneResultPage(queryId, 0);
  }
  if (!executionEndedAt) {
    executionEndedAt = new Date().toISOString();
  }

  let offset = 0;
  let upserted = 0;
  let page = first;
  while (true) {
    if (page.rows.length === 0) break;
    await upsertTxnRows(page.rows);
    upserted += page.rows.length;
    console.log(`[dune] backfill upserted ${upserted} rows (offset ${offset})`);
    if (page.rows.length < DUNE_PAGE_SIZE) break;
    offset += DUNE_PAGE_SIZE;
    page = await fetchDuneResultPage(queryId, offset);
  }

  await setDuneSyncState(executionEndedAt);
  return { upserted, executionEndedAt };
}

export async function syncDuneResults(): Promise<void> {
  const queryId = resolveDuneQueryId();
  if (queryId === null) {
    throw new Error("Missing or invalid DUNE_QUERY_ID");
  }
  duneApiKey();

  const executionId = await executeDuneQuery(queryId);
  const executionEndedAt = await pollDuneExecution(executionId);

  const state = await getDuneSyncState();
  if (
    state.last_execution_ended_at &&
    state.last_execution_ended_at === executionEndedAt
  ) {
    return;
  }

  const storedMaxBlock = await getMaxStoredBlockNumber();
  let offset = 0;

  while (true) {
    const { rows } = await fetchDuneResultPage(queryId, offset);
    if (rows.length === 0) break;

    const hashes = rows.map((r) => r.hash);
    const known = await existingHashes(hashes);
    const allKnown = hashes.every((h) => known.has(h));
    const minBlock = Math.min(...rows.map((r) => r.block_number));

    await upsertTxnRows(rows);

    const overlapped =
      storedMaxBlock !== null && minBlock < storedMaxBlock;
    if (allKnown || overlapped) break;
    if (rows.length < DUNE_PAGE_SIZE) break;
    offset += DUNE_PAGE_SIZE;
  }

  await setDuneSyncState(executionEndedAt);
}

function parseContentRangeTotal(header: string | null): number | null {
  if (!header) return null;
  const slash = header.lastIndexOf("/");
  if (slash < 0) return null;
  const raw = header.slice(slash + 1).trim();
  if (raw === "*") return null;
  const total = Number(raw);
  return Number.isFinite(total) ? total : null;
}

async function readStoredTxns(): Promise<CelinaTxRow[]> {
  const rows: CelinaTxRow[] = [];
  let from = 0;
  let expectedTotal: number | null = null;
  while (true) {
    const to = from + SB_PAGE_SIZE - 1;
    const res = await sbFetch(
      `/rest/v1/dune_celina_txns?select=*&order=block_time.desc`,
      {
        headers: {
          Range: `${from}-${to}`,
          Prefer: "count=exact",
        },
      },
    );
    // 206 = partial page; 200 = full result within one page
    if (!res.ok && res.status !== 206) {
      throw new Error(
        `Supabase read dune_celina_txns ${res.status}: ${(await res.text()).slice(0, 200)}`,
      );
    }
    const page = (await res.json()) as Array<Record<string, unknown>>;
    for (const r of page) {
      const mapped = mapDuneRow(r);
      if (mapped) rows.push(mapped);
    }
    if (expectedTotal === null) {
      expectedTotal = parseContentRangeTotal(res.headers.get("content-range"));
    }
    if (page.length === 0) break;
    if (expectedTotal !== null && rows.length >= expectedTotal) break;
    if (page.length < SB_PAGE_SIZE) break;
    from += page.length;
  }
  return rows;
}

export const getCelinaStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<CelinaStatsResult> => {
    if (!process.env.CUSTOM_SUPABASE_URL || !process.env.CUSTOM_SUPABASE_SERVICE_ROLE_KEY) {
      return unavailableResult();
    }

    const queryId = resolveDuneQueryId();
    const queryUrl = queryId !== null ? duneQueryUrl(queryId) : null;

    try {
      const [rows, stateRes] = await Promise.all([
        readStoredTxns(),
        sbFetch(
          "/rest/v1/dune_sync_state?select=last_execution_ended_at&id=eq.1",
        ),
      ]);
      let queryExecutedAt: string | null = null;
      if (stateRes.ok) {
        const stateRows = (await stateRes.json()) as Array<{
          last_execution_ended_at: string | null;
        }>;
        queryExecutedAt = stateRows[0]?.last_execution_ended_at ?? null;
      }
      return {
        rows,
        fetchedAt: Date.now(),
        queryExecutedAt,
        error: null,
        queryUrl,
      };
    } catch (e) {
      console.error("[dune] supabase read failed:", e);
      return {
        rows: [],
        fetchedAt: Date.now(),
        queryExecutedAt: null,
        error: UNAVAILABLE_PROVIDER_MSG,
        queryUrl,
      };
    }
  },
);
