import { createServerFn } from "@tanstack/react-start";
import { statsApiBaseUrl, statsApiHeaders } from "./stats-api.ts";

export type AmplitudeEventDay = {
  day: string;
  count: number;
};

export type AmplitudeEventTotal = {
  event: string;
  count: number;
};

export type AmplitudeProjectTotal = {
  project: string;
  count: number;
};

export type OffchainEventRow = {
  insert_id: string;
  event_time: string;
  event_type: string;
  device_id: string;
};

export type AmplitudeStatsResult = {
  daily: AmplitudeEventDay[];
  dailyWalletsQueried: AmplitudeEventDay[];
  perTool: AmplitudeEventTotal[];
  projects: AmplitudeProjectTotal[];
  events: OffchainEventRow[];
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
  projects: [],
  events: [],
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
type ProjectsBody = { rows?: AmplitudeProjectTotal[]; error?: string };
type DevicesBody = { uniqueDevices?: number; error?: string };
type SyncBody = { lastSyncedAt?: string | null; error?: string };
type EventsBody = { rows?: OffchainEventRow[]; lastSyncedAt?: string | null; error?: string };

export const getAmplitudeStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<AmplitudeStatsResult> => {
    const base = statsApiBaseUrl();
    const headers = statsApiHeaders();
    try {
      const [dailyRes, walletsRes, toolsRes, projectsRes, devicesRes, syncRes, eventsRes] =
        await Promise.all([
          fetch(`${base}/offchain/daily`, { headers }),
          fetch(`${base}/offchain/wallets`, { headers }),
          fetch(`${base}/offchain/tools`, { headers }),
          fetch(`${base}/offchain/projects`, { headers }),
          fetch(`${base}/offchain/devices`, { headers }),
          fetch(`${base}/offchain/sync`, { headers }),
          fetch(`${base}/offchain/events`, { headers }),
        ]);
      const failed = [
        dailyRes,
        walletsRes,
        toolsRes,
        projectsRes,
        devicesRes,
        syncRes,
        eventsRes,
      ].find((res) => !res.ok);
      if (failed) {
        throw new Error(`Stats API ${failed.status}`);
      }

      const [daily, wallets, tools, projects, devices, sync, events] = (await Promise.all([
        dailyRes.json(),
        walletsRes.json(),
        toolsRes.json(),
        projectsRes.json(),
        devicesRes.json(),
        syncRes.json(),
        eventsRes.json(),
      ])) as [DailyBody, WalletsBody, ToolsBody, ProjectsBody, DevicesBody, SyncBody, EventsBody];

      const error =
        daily.error ||
        wallets.error ||
        tools.error ||
        projects.error ||
        devices.error ||
        sync.error ||
        events.error;
      if (error && (!daily.rows || daily.rows.length === 0)) {
        return empty(error);
      }

      return {
        daily: daily.rows ?? [],
        dailyWalletsQueried: wallets.daily ?? [],
        perTool: tools.rows ?? [],
        projects: projects.rows ?? [],
        events: events.rows ?? [],
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
