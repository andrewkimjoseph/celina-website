export const DEFAULT_STATS_API_BASE_URL = "https://api.stats.usecelina.xyz";

export function statsApiBaseUrl(): string {
  const raw = process.env.STATS_API_BASE_URL?.trim();
  return (raw || DEFAULT_STATS_API_BASE_URL).replace(/\/+$/, "");
}
