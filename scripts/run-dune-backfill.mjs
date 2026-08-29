import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const name of [".env.local", ".env"]) {
  const p = resolve(root, name);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m || process.env[m[1]] !== undefined) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const required = [
  "DUNE_API_KEY",
  "DUNE_QUERY_ID",
  "CUSTOM_SUPABASE_URL",
  "CUSTOM_SUPABASE_SERVICE_ROLE_KEY",
];
const missing = required.filter((k) => !process.env[k]?.trim());
if (missing.length) {
  throw new Error(`Missing ${missing.join(", ")}`);
}

const { backfillDuneResults } = await import("../src/lib/dune.functions.ts");
const t0 = Date.now();
const { upserted, executionEndedAt } = await backfillDuneResults();
console.log(
  `backfill ok: ${upserted} rows in ${((Date.now() - t0) / 1000).toFixed(1)}s (execution_ended_at ${executionEndedAt})`,
);
