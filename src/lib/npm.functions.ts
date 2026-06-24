import { createServerFn } from "@tanstack/react-start";
import { fmtUtcDay, getNpmRangeStart } from "./npm-aggregate";

export type NpmDownloadDay = { day: string; downloads: number };

export type NpmDownloadsResult = {
  rows: NpmDownloadDay[];
  fetchedAt: number;
  error: string | null;
  partial: boolean;
  failedPackages: string[];
};

const PACKAGES = [
  "@andrewkimjoseph/celina-mcp",
  "@andrewkimjoseph/celina-sdk",
  "@andrewkimjoseph/celina",
] as const;

const RETRY_DELAY_MS = 500;

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

async function fetchPackageDownloads(
  pkg: string,
  range: string,
): Promise<Array<{ day: string; downloads: number }>> {
  const url = `https://api.npmjs.org/downloads/range/${range}/${pkg}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 404) return [];
      if (!res.ok) {
        if (attempt === 0 && isRetryableStatus(res.status)) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          continue;
        }
        throw new Error(`npm API ${res.status} for ${pkg}: ${res.statusText}`);
      }
      const json = (await res.json()) as {
        downloads?: Array<{ day: string; downloads: number }>;
      };
      return json.downloads ?? [];
    } catch (e) {
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      throw e instanceof Error ? e : new Error(`Failed to fetch ${pkg}`);
    }
  }
  return [];
}

function mergeDownloads(
  lists: Array<Array<{ day: string; downloads: number }>>,
): NpmDownloadDay[] {
  const merged = new Map<string, number>();
  for (const list of lists) {
    for (const d of list) {
      const day = String(d.day);
      merged.set(day, (merged.get(day) ?? 0) + Number(d.downloads ?? 0));
    }
  }
  return Array.from(merged.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, downloads]) => ({ day, downloads }));
}

export const getNpmDownloads = createServerFn({ method: "GET" }).handler(
  async (): Promise<NpmDownloadsResult> => {
    const end = new Date();
    const start = getNpmRangeStart(end);
    const range = `${fmtUtcDay(start)}:${fmtUtcDay(end)}`;
    const fetchedAt = Date.now();

    const settled = await Promise.allSettled(
      PACKAGES.map(async (pkg) => ({
        pkg,
        downloads: await fetchPackageDownloads(pkg, range),
      })),
    );

    const succeeded: Array<Array<{ day: string; downloads: number }>> = [];
    const failedPackages: string[] = [];

    for (let i = 0; i < settled.length; i++) {
      const result = settled[i];
      const pkg = PACKAGES[i];
      if (result.status === "fulfilled") {
        succeeded.push(result.value.downloads);
      } else {
        const reason =
          result.reason instanceof Error ? result.reason.message : String(result.reason);
        failedPackages.push(`${pkg}: ${reason}`);
      }
    }

    if (succeeded.length === 0) {
      return {
        rows: [],
        fetchedAt,
        error: failedPackages.join("; ") || "Failed to fetch npm downloads",
        partial: false,
        failedPackages,
      };
    }

    const rows = mergeDownloads(succeeded);
    const partial = failedPackages.length > 0;

    return {
      rows,
      fetchedAt,
      error: partial ? `Partial npm data: ${failedPackages.join("; ")}` : null,
      partial,
      failedPackages,
    };
  },
);
