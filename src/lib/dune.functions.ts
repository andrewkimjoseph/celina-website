import { createServerFn } from "@tanstack/react-start";

export type CelinaTxRow = {
  day: string;
  txn_count: number;
  cumulative_txns: number;
  hash: string;
  block_time: string;
  block_number: number;
  from: string;
  to: string;
};

export type CelinaStatsResult = {
  rows: CelinaTxRow[];
  fetchedAt: number;
  error: string | null;
  queryUrl: string | null;
};

const UNAVAILABLE_MSG = "On-chain stats are temporarily unavailable.";
const UNAVAILABLE_PROVIDER_MSG =
  "On-chain stats are temporarily unavailable (data provider unreachable).";

function resolveDuneQueryId(): number | null {
  const raw = process.env.DUNE_QUERY_ID?.trim();
  if (!raw) return null;
  const id = Number.parseInt(raw, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

function duneQueryUrl(id: number): string {
  return `https://dune.com/queries/${id}`;
}

function unavailableResult(): CelinaStatsResult {
  return {
    rows: [],
    fetchedAt: Date.now(),
    error: UNAVAILABLE_MSG,
    queryUrl: null,
  };
}

export const getCelinaStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<CelinaStatsResult> => {
    const queryId = resolveDuneQueryId();
    if (queryId === null) {
      return unavailableResult();
    }

    const apiKey = process.env.DUNE_API_KEY;
    if (!apiKey) {
      return unavailableResult();
    }

    const queryUrl = duneQueryUrl(queryId);

    try {
      const res = await fetch(
        `https://api.dune.com/api/v1/query/${queryId}/results?limit=1000`,
        {
          headers: { "X-Dune-API-Key": apiKey },
        },
      );
      if (!res.ok) {
        console.error(
          `[dune] query ${queryId} failed: ${res.status} ${res.statusText}`,
        );
        return {
          rows: [],
          fetchedAt: Date.now(),
          error: UNAVAILABLE_PROVIDER_MSG,
          queryUrl: null,
        };
      }
      const json = (await res.json()) as {
        result?: { rows?: Array<Record<string, unknown>> };
      };
      const raw = json.result?.rows ?? [];
      const rows: CelinaTxRow[] = raw.map((r) => ({
        day: String(r.day ?? ""),
        txn_count: Number(r.txn_count ?? 0),
        cumulative_txns: Number(r.cumulative_txns ?? 0),
        hash: String(r.hash ?? ""),
        block_time: String(r.block_time ?? ""),
        block_number: Number(r.block_number ?? 0),
        from: String(r.from ?? ""),
        to: String(r.to ?? ""),
      }));
      return { rows, fetchedAt: Date.now(), error: null, queryUrl };
    } catch (e) {
      console.error("[dune] fetch failed:", e);
      return {
        rows: [],
        fetchedAt: Date.now(),
        error: UNAVAILABLE_PROVIDER_MSG,
        queryUrl: null,
      };
    }
  },
);
