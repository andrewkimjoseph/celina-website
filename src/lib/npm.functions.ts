import { createServerFn } from "@tanstack/react-start";

export type NpmDownloadDay = { day: string; downloads: number };

export type NpmDownloadsResult = {
  rows: NpmDownloadDay[];
  fetchedAt: number;
  error: string | null;
};

const PACKAGE = "@andrewkimjoseph/celina";

function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

export const getNpmDownloads = createServerFn({ method: "GET" }).handler(
  async (): Promise<NpmDownloadsResult> => {
    const end = new Date();
    const start = new Date();
    start.setUTCDate(end.getUTCDate() - 364);
    const url = `https://api.npmjs.org/downloads/range/${fmt(start)}:${fmt(end)}/${PACKAGE}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        return {
          rows: [],
          fetchedAt: Date.now(),
          error: `npm API ${res.status}: ${res.statusText}`,
        };
      }
      const json = (await res.json()) as {
        downloads?: Array<{ day: string; downloads: number }>;
      };
      const rows: NpmDownloadDay[] = (json.downloads ?? []).map((d) => ({
        day: String(d.day),
        downloads: Number(d.downloads ?? 0),
      }));
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