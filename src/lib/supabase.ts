export function supabaseConfig() {
  const url = process.env.CUSTOM_SUPABASE_URL;
  const key = process.env.CUSTOM_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing CUSTOM_SUPABASE_URL or CUSTOM_SUPABASE_SERVICE_ROLE_KEY");
  }
  return { url: url.replace(/\/+$/, ""), key };
}

export async function sbFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const { url, key } = supabaseConfig();
  const res = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  return res;
}

export async function sbRpcScalar(
  name: string,
  body: Record<string, unknown>,
): Promise<number> {
  const res = await sbFetch(`/rest/v1/rpc/${name}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(
      `Supabase rpc ${name} ${res.status}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  const value = await res.json();
  return Number(value ?? 0);
}
