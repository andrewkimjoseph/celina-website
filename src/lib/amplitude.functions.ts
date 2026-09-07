import { createServerFn } from "@tanstack/react-start";
import { statsApiBaseUrl } from "./stats-api.ts";

export type AmplitudeEventDay = {
  day: string;
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

const empty = (error: string | null): AmplitudeStatsResult => ({
  daily: [],
  dailyWalletsQueried: [],
  perTool: [],
  total: 0,
  uniqueDevices: 0,
  walletsQueried: 0,
  fetchedAt: Date.now(),
  lastSyncedAt: null,
  error,
});

export const getAmplitudeStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<AmplitudeStatsResult> => {
    try {
      const res = await fetch(`${statsApiBaseUrl()}/offchain`);
      if (!res.ok) {
        throw new Error(`Stats API ${res.status}`);
      }
      const json = (await res.json()) as Omit<AmplitudeStatsResult, "fetchedAt"> & {
        error?: string;
      };
      if (json.error && (!json.daily || json.daily.length === 0)) {
        return empty(json.error);
      }
      return {
        daily: json.daily ?? [],
        dailyWalletsQueried: json.dailyWalletsQueried ?? [],
        perTool: json.perTool ?? [],
        total: json.total ?? 0,
        uniqueDevices: json.uniqueDevices ?? 0,
        walletsQueried: json.walletsQueried ?? 0,
        fetchedAt: Date.now(),
        lastSyncedAt: json.lastSyncedAt ?? null,
        error: null,
      };
    } catch (e) {
      console.error("[stats] offchain fetch failed:", e);
      return empty(e instanceof Error ? e.message : "Failed to load off-chain stats");
    }
  },
);
