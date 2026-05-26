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
};

const DUNE_QUERY_ID = 7576390;

export const getCelinaStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<CelinaStatsResult> => {
    const apiKey = process.env.DUNE_API_KEY;
    if (!apiKey) {
      return { rows: [], fetchedAt: Date.now(), error: "Missing DUNE_API_KEY" };
    }

    try {
      const res = await fetch(
        `https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/results?limit=1000`,
        {
          headers: { "X-Dune-API-Key": apiKey },
        },
      );
      if (!res.ok) {
        return {
          rows: [],
          fetchedAt: Date.now(),
          error: `Dune API ${res.status}: ${res.statusText}`,
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
      return { rows, fetchedAt: Date.now(), error: null };
    } catch (e) {
      return {
        rows: [],
        fetchedAt: Date.now(),
        error: e instanceof Error ? e.message : "Failed to fetch Dune results",
      };
    }
  },
);