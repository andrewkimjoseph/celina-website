import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCelinaStats, type CelinaTxRow } from "./dune.functions";
import { withTimeout } from "./refresh-utils";

type StatsState = {
  rows: CelinaTxRow[];
  fetchedAt: number | null;
  loading: boolean;
  error: string | null;
  refresh: (opts?: { force?: boolean }) => Promise<void>;
};

export const STALE_MS = 5 * 60 * 1000;

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      rows: [],
      fetchedAt: null,
      loading: false,
      error: null,
      refresh: async (opts) => {
        const { fetchedAt, loading } = get();
        if (loading && !opts?.force) return;
        if (
          !opts?.force &&
          fetchedAt &&
          Date.now() - fetchedAt < STALE_MS &&
          get().rows.length > 0
        ) {
          return;
        }
        set({ loading: true, error: null });
        try {
          const result = await withTimeout(
            getCelinaStats(),
            45_000,
            "On-chain stats",
          );
          set({
            rows: result.rows,
            fetchedAt: result.fetchedAt,
            error: result.error,
          });
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : "Failed to load stats",
          });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "celina-stats",
      partialize: (s) => ({ rows: s.rows, fetchedAt: s.fetchedAt }),
    },
  ),
);