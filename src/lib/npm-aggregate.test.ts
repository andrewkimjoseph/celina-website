import { describe, expect, it } from "vitest";
import { aggregateNpm, fillDailyRange } from "./npm-aggregate";

describe("fillDailyRange", () => {
  it("fills missing days with zero downloads", () => {
    const filled = fillDailyRange(
      [
        { day: "2026-06-01", downloads: 10 },
        { day: "2026-06-03", downloads: 5 },
      ],
      "2026-06-01",
      "2026-06-03",
    );

    expect(filled).toEqual([
      { day: "2026-06-01", downloads: 10 },
      { day: "2026-06-02", downloads: 0 },
      { day: "2026-06-03", downloads: 5 },
    ]);
  });
});

describe("aggregateNpm", () => {
  it("sums last 7 calendar days including zero-download gaps", () => {
    const agg = aggregateNpm(
      [
        { day: "2026-06-18", downloads: 4 },
        { day: "2026-06-20", downloads: 6 },
      ],
      "2026-06-20",
    );

    expect(agg.last7).toBe(10);
  });

  it("merges same-day totals across packages before aggregating", () => {
    const agg = aggregateNpm(
      [
        { day: "2026-06-19", downloads: 3 },
        { day: "2026-06-20", downloads: 7 },
      ],
      "2026-06-20",
    );

    expect(agg.last7).toBe(10);
    expect(agg.total365).toBeGreaterThanOrEqual(10);
  });

  it("returns zeros for empty input", () => {
    const agg = aggregateNpm([], "2026-06-20");

    expect(agg.total365).toBe(0);
    expect(agg.last7).toBe(0);
    expect(agg.last30).toBe(0);
    expect(agg.avg30).toBe(0);
    expect(agg.daily90).toHaveLength(90);
    expect(agg.cumulative.at(-1)?.total).toBe(0);
  });
});
