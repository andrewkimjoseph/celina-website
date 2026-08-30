export type CumulativeSourceRow = {
  hash: string;
  day?: string;
  block_time: string;
};

export type CumulativeDay = {
  day: string;
  count: number;
  cumulative: number;
};

export function parseBlockTime(s: string): Date | null {
  const d = new Date(s.replace(" UTC", "Z").replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** UTC YYYY-MM-DD from block_time; falls back to stored `day` for older rows. */
export function dayKey(row: CumulativeSourceRow): string {
  const fromBlock = parseBlockTime(row.block_time);
  if (fromBlock) return fromBlock.toISOString().slice(0, 10);
  if (row.day) {
    const fromDay = parseBlockTime(row.day);
    if (fromDay) return fromDay.toISOString().slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}/.test(row.day)) return row.day.slice(0, 10);
  }
  return "";
}

export function dailyCumulative(rows: CumulativeSourceRow[]): CumulativeDay[] {
  const dayHashes = new Map<string, Set<string>>();
  for (const r of rows) {
    const day = dayKey(r);
    if (!day || !r.hash) continue;
    let hashes = dayHashes.get(day);
    if (!hashes) {
      hashes = new Set();
      dayHashes.set(day, hashes);
    }
    hashes.add(r.hash);
  }

  let running = 0;
  return Array.from(dayHashes.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, hashes]) => {
      running += hashes.size;
      return { day, count: hashes.size, cumulative: running };
    });
}
