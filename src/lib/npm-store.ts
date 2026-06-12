import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getNpmDownloads, type NpmDownloadDay } from "./npm.functions";
import { withTimeout } from "./refresh-utils";
import { STALE_MS } from "./stats-store";

type NpmState = {
  rows: NpmDownloadDay[];
  fetchedAt: number | null;
  loading: boolean;
  error: string | null;
  refresh: (opts?: { force?: boolean }) => Promise<void>;
};

export const useNpmStore = create<NpmState>()(
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
            getNpmDownloads(),
            45_000,
            "npm downloads",
          );
          set({
            rows: result.rows,
            fetchedAt: result.fetchedAt,
            error: result.error,
          });
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : "Failed to load npm downloads",
          });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "celina-npm",
      partialize: (s) => ({ rows: s.rows, fetchedAt: s.fetchedAt }),
    },
  ),
);