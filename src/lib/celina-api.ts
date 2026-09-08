export const DEFAULT_CELINA_API_BASE_URL = "https://api.usecelina.xyz";

export function celinaApiBaseUrl(): string {
  const raw = process.env.CELINA_API_BASE_URL?.trim();
  return (raw || DEFAULT_CELINA_API_BASE_URL).replace(/\/+$/, "");
}
