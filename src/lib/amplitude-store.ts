import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getAmplitudeStats,
  type AmplitudeEventDay,
  type AmplitudeEventTotal,
} from "./amplitude.functions";
import { withTimeout } from "./refresh-utils";
import { STALE_MS } from "./stats-store";

type AmplitudeState = {
  daily: AmplitudeEventDay[];
  dailyWalletsQueried: AmplitudeEventDay[];
  perTool: AmplitudeEventTotal[];
  total: number;
  uniqueDevices: number;
  walletsQueried: number;
  fetchedAt: number | null;
  lastSyncedAt: string | null;
  loading: boolean;
  error: string | null;
  partial: boolean;
  refresh: (opts?: { force?: boolean }) => Promise<void>;
};

export const useAmplitudeStore = create<AmplitudeState>()(
  persist(
    (set, get) => ({
      daily: [],
      dailyWalletsQueried: [],
      perTool: [],
      total: 0,
      uniqueDevices: 0,
      walletsQueried: 0,
      fetchedAt: null,
      lastSyncedAt: null,
      loading: false,
      error: null,
      partial: false,
      refresh: async (opts) => {
        const { fetchedAt, loading } = get();
        if (loading && !opts?.force) return;
        if (
          !opts?.force &&
          fetchedAt &&
          Date.now() - fetchedAt < STALE_MS &&
          get().daily.length > 0
        ) {
          return;
        }
        set({ loading: true, error: null, partial: false });
        try {
          const result = await withTimeout(
            getAmplitudeStats(),
            90_000,
            "Off-chain stats",
          );
          const hasRows = result.daily.length > 0;
          const keepCache = Boolean(result.error) && !hasRows;

          set({
            ...(keepCache
              ? {}
              : {
                  daily: result.daily,
                  dailyWalletsQueried: result.dailyWalletsQueried,
                  perTool: result.perTool,
                  total: result.total,
                  uniqueDevices: result.uniqueDevices,
                  walletsQueried: result.walletsQueried,
                  fetchedAt: result.fetchedAt,
                  lastSyncedAt: result.lastSyncedAt,
                }),
            error: result.error,
            partial: Boolean(result.error) && hasRows,
          });
        } catch (e) {
          const message =
            e instanceof Error ? e.message : "Failed to load Amplitude stats";
          const hasCache = get().daily.length > 0;
          set({
            error: message,
            partial: hasCache,
          });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "celina-amplitude-v8",
      partialize: (s) => ({
        daily: s.daily,
        dailyWalletsQueried: s.dailyWalletsQueried,
        perTool: s.perTool,
        total: s.total,
        uniqueDevices: s.uniqueDevices,
        walletsQueried: s.walletsQueried,
        fetchedAt: s.fetchedAt,
        lastSyncedAt: s.lastSyncedAt,
      }),
    },
  ),
);
