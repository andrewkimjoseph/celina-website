import { createServerFn } from "@tanstack/react-start";
import { celinaApiBaseUrl } from "./celina-api.ts";

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

type DailyBody = { rows?: AmplitudeEventDay[]; total?: number; error?: string };
type WalletsBody = {
  daily?: AmplitudeEventDay[];
  total?: number;
  error?: string;
};
type ToolsBody = { rows?: AmplitudeEventTotal[]; error?: string };
type DevicesBody = { uniqueDevices?: number; error?: string };
type SyncBody = { lastSyncedAt?: string | null; error?: string };

export const getAmplitudeStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<AmplitudeStatsResult> => {
    const base = celinaApiBaseUrl();
    try {
      const [dailyRes, walletsRes, toolsRes, devicesRes, syncRes] =
        await Promise.all([
          fetch(`${base}/offchain/daily`),
          fetch(`${base}/offchain/wallets`),
          fetch(`${base}/offchain/tools`),
          fetch(`${base}/offchain/devices`),
          fetch(`${base}/offchain/sync`),
        ]);
      const failed = [
        dailyRes,
        walletsRes,
        toolsRes,
        devicesRes,
        syncRes,
      ].find((res) => !res.ok);
      if (failed) {
        throw new Error(`Celina API ${failed.status}`);
      }

      const [daily, wallets, tools, devices, sync] = (await Promise.all([
        dailyRes.json(),
        walletsRes.json(),
        toolsRes.json(),
        devicesRes.json(),
        syncRes.json(),
      ])) as [DailyBody, WalletsBody, ToolsBody, DevicesBody, SyncBody];

      const error =
        daily.error ||
        wallets.error ||
        tools.error ||
        devices.error ||
        sync.error;
      if (error && (!daily.rows || daily.rows.length === 0)) {
        return empty(error);
      }

      return {
        daily: daily.rows ?? [],
        dailyWalletsQueried: wallets.daily ?? [],
        perTool: tools.rows ?? [],
        total: daily.total ?? 0,
        uniqueDevices: devices.uniqueDevices ?? 0,
        walletsQueried: wallets.total ?? 0,
        fetchedAt: Date.now(),
        lastSyncedAt: sync.lastSyncedAt ?? null,
        error: null,
      };
    } catch (e) {
      console.error("[stats] offchain fetch failed:", e);
      return empty(e instanceof Error ? e.message : "Failed to load off-chain stats");
    }
  },
);
