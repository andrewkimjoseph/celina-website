import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getAmplitudeStats,
  type AmplitudeEventDay,
  type AmplitudeEventTotal,
} from "./amplitude.functions";
import { STALE_MS } from "./stats-store";

type AmplitudeState = {
  daily: AmplitudeEventDay[];
  dailyWallets: AmplitudeEventDay[];
  perTool: AmplitudeEventTotal[];
  total: number;
  uniqueDevices: number;
  uniqueWallets: number;
  fetchedAt: number | null;
  lastSyncedAt: string | null;
  loading: boolean;
  error: string | null;
  refresh: (opts?: { force?: boolean }) => Promise<void>;
};

export const useAmplitudeStore = create<AmplitudeState>()(
  persist(
    (set, get) => ({
      daily: [],
      dailyWallets: [],
      perTool: [],
      total: 0,
      uniqueDevices: 0,
      uniqueWallets: 0,
      fetchedAt: null,
      lastSyncedAt: null,
      loading: false,
      error: null,
      refresh: async (opts) => {
        const { fetchedAt, loading } = get();
        if (loading) return;
        if (
          !opts?.force &&
          fetchedAt &&
          Date.now() - fetchedAt < STALE_MS &&
          get().daily.length > 0
        )
          return;
        set({ loading: true, error: null });
        try {
          const result = await getAmplitudeStats();
          set({
            daily: result.daily,
            dailyWallets: result.dailyWallets,
            perTool: result.perTool,
            total: result.total,
            uniqueDevices: result.uniqueDevices,
            uniqueWallets: result.uniqueWallets,
            fetchedAt: result.fetchedAt,
            lastSyncedAt: result.lastSyncedAt,
            error: result.error,
            loading: false,
          });
        } catch (e) {
          set({
            loading: false,
            error:
              e instanceof Error ? e.message : "Failed to load Amplitude stats",
          });
        }
      },
    }),
    {
      name: "celina-amplitude-v6",
      partialize: (s) => ({
        daily: s.daily,
        dailyWallets: s.dailyWallets,
        perTool: s.perTool,
        total: s.total,
        uniqueDevices: s.uniqueDevices,
        uniqueWallets: s.uniqueWallets,
        fetchedAt: s.fetchedAt,
        lastSyncedAt: s.lastSyncedAt,
      }),
    },
  ),
);
