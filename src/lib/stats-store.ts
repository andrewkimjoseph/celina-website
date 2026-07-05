import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCelinaStats, type CelinaTxRow } from "./dune.functions";
import { withTimeout } from "./refresh-utils";

type StatsState = {
  rows: CelinaTxRow[];
  fetchedAt: number | null;
  queryUrl: string | null;
  loading: boolean;
  error: string | null;
  partial: boolean;
  refresh: (opts?: { force?: boolean }) => Promise<void>;
};

export const STALE_MS = 5 * 60 * 1000;

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      rows: [],
      fetchedAt: null,
      queryUrl: null,
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
          get().rows.length > 0
        ) {
          return;
        }
        set({ loading: true, error: null, partial: false });
        try {
          const result = await withTimeout(
            getCelinaStats(),
            45_000,
            "On-chain stats",
          );
          const hasRows = result.rows.length > 0;
          const keepCache = Boolean(result.error) && !hasRows;

          set({
            ...(keepCache
              ? {}
              : {
                  rows: result.rows,
                  fetchedAt: result.fetchedAt,
                  queryUrl: result.queryUrl,
                }),
            error: result.error,
            partial:
              Boolean(result.error) &&
              (keepCache ? get().rows.length > 0 : hasRows),
          });
        } catch (e) {
          const message =
            e instanceof Error ? e.message : "Failed to load stats";
          const hasCache = get().rows.length > 0;
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
      name: "celina-stats",
      partialize: (s) => ({
        rows: s.rows,
        fetchedAt: s.fetchedAt,
        queryUrl: s.queryUrl,
      }),
    },
  ),
);
