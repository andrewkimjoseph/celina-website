import { createServerFn } from "@tanstack/react-start";
import { statsApiBaseUrl } from "./stats-api.ts";

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
  lastSyncedAt: string | null;
  error: string | null;
};

const UNAVAILABLE_MSG = "On-chain stats are temporarily unavailable.";

export const getCelinaStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<CelinaStatsResult> => {
    try {
      const res = await fetch(`${statsApiBaseUrl()}/onchain`);
      if (!res.ok) {
        throw new Error(`Stats API ${res.status}`);
      }
      const json = (await res.json()) as {
        rows?: CelinaTxRow[];
        lastSyncedAt?: string | null;
        error?: string;
      };
      if (json.error && (!json.rows || json.rows.length === 0)) {
        return {
          rows: [],
          fetchedAt: Date.now(),
          lastSyncedAt: json.lastSyncedAt ?? null,
          error: json.error,
        };
      }
      return {
        rows: json.rows ?? [],
        fetchedAt: Date.now(),
        lastSyncedAt: json.lastSyncedAt ?? null,
        error: null,
      };
    } catch (e) {
      console.error("[stats] onchain fetch failed:", e);
      return {
        rows: [],
        fetchedAt: Date.now(),
        lastSyncedAt: null,
        error: UNAVAILABLE_MSG,
      };
    }
  },
);
