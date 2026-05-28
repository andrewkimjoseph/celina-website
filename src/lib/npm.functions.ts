import { createServerFn } from "@tanstack/react-start";

export type NpmDownloadDay = { day: string; downloads: number };

export type NpmDownloadsResult = {
  rows: NpmDownloadDay[];
  fetchedAt: number;
  error: string | null;
};

const PACKAGES = [
  "@andrewkimjoseph/celina-mcp",
  "@andrewkimjoseph/celina-sdk",
  "@andrewkimjoseph/celina",
] as const;

function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

export const getNpmDownloads = createServerFn({ method: "GET" }).handler(
  async (): Promise<NpmDownloadsResult> => {
    const end = new Date();
    const start = new Date();
    start.setUTCDate(end.getUTCDate() - 364);
    const range = `${fmt(start)}:${fmt(end)}`;

    try {
      const results = await Promise.all(
        PACKAGES.map(async (pkg) => {
          const res = await fetch(
            `https://api.npmjs.org/downloads/range/${range}/${pkg}`,
          );
          if (!res.ok) {
            // 404 = package has no downloads in range; treat as empty, not fatal
            if (res.status === 404) return [] as Array<{ day: string; downloads: number }>;
            throw new Error(`npm API ${res.status} for ${pkg}: ${res.statusText}`);
          }
          const json = (await res.json()) as {
            downloads?: Array<{ day: string; downloads: number }>;
          };
          return json.downloads ?? [];
        }),
      );

      const merged = new Map<string, number>();
      for (const list of results) {
        for (const d of list) {
          const day = String(d.day);
          merged.set(day, (merged.get(day) ?? 0) + Number(d.downloads ?? 0));
        }
      }
      const rows: NpmDownloadDay[] = Array.from(merged.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, downloads]) => ({ day, downloads }));
      return { rows, fetchedAt: Date.now(), error: null };
    } catch (e) {
      return {
        rows: [],
        fetchedAt: Date.now(),
        error: e instanceof Error ? e.message : "Failed to fetch npm downloads",
      };
    }
  },
);