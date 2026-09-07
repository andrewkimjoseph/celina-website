import { createServerFn } from "@tanstack/react-start";
import { statsApiBaseUrl } from "./stats-api.ts";

export type NpmDownloadDay = { day: string; downloads: number };

export type NpmDownloadsResult = {
  rows: NpmDownloadDay[];
  fetchedAt: number;
  error: string | null;
  partial: boolean;
  failedPackages: string[];
};

const empty = (error: string | null): NpmDownloadsResult => ({
  rows: [],
  fetchedAt: Date.now(),
  error,
  partial: false,
  failedPackages: [],
});

export const getNpmDownloads = createServerFn({ method: "GET" }).handler(
  async (): Promise<NpmDownloadsResult> => {
    try {
      const res = await fetch(`${statsApiBaseUrl()}/package`);
      if (!res.ok && res.status !== 502) {
        throw new Error(`Stats API ${res.status}`);
      }
      const json = (await res.json()) as {
        rows?: NpmDownloadDay[];
        lastSyncedAt?: string | null;
        error?: string;
        partial?: boolean;
        failedPackages?: string[];
      };
      if (json.error && (!json.rows || json.rows.length === 0)) {
        return empty(json.error);
      }
      return {
        rows: json.rows ?? [],
        fetchedAt: Date.now(),
        error: json.error ?? null,
        partial: Boolean(json.partial),
        failedPackages: json.failedPackages ?? [],
      };
    } catch (e) {
      console.error("[stats] package fetch failed:", e);
      return empty(e instanceof Error ? e.message : "Failed to load npm downloads");
    }
  },
);
