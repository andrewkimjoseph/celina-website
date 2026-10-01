import { describe, expect, it } from "vitest";
import type { StateStorage } from "zustand/middleware";
import { LEGACY_AMPLITUDE_STORAGE_KEY, quotaSafeStorage } from "./persist-storage";

function memoryStorage(options?: {
  failSetUntilRemoved?: string[];
  alwaysFailSet?: boolean;
}): StateStorage & { dump: () => Record<string, string> } {
  const data = new Map<string, string>();
  const failUntilRemoved = new Set(options?.failSetUntilRemoved ?? []);

  return {
    dump: () => Object.fromEntries(data),
    getItem: (name) => data.get(name) ?? null,
    setItem: (name, value) => {
      if (options?.alwaysFailSet || failUntilRemoved.has(name)) {
        const error = new Error(`Setting the value of '${name}' exceeded the quota.`);
        error.name = "QuotaExceededError";
        throw error;
      }
      data.set(name, value);
    },
    removeItem: (name) => {
      data.delete(name);
      failUntilRemoved.delete(name);
    },
  };
}

describe("quotaSafeStorage", () => {
  it("retries a quota error after removing the key", () => {
    const inner = memoryStorage({ failSetUntilRemoved: ["celina-amplitude-v12"] });
    inner.setItem(LEGACY_AMPLITUDE_STORAGE_KEY, "oversized");
    const storage = quotaSafeStorage(inner);

    storage.setItem("celina-amplitude-v12", "small");

    expect(inner.dump()).toEqual({ "celina-amplitude-v12": "small" });
  });

  it("swallows a quota error when the retry also fails", () => {
    const inner = memoryStorage({ alwaysFailSet: true });
    const storage = quotaSafeStorage(inner);

    expect(() => storage.setItem("celina-npm-v2", "rows")).not.toThrow();
    expect(inner.dump()).toEqual({});
  });

  it("drops the legacy amplitude blob on first read", () => {
    const inner = memoryStorage();
    inner.setItem(LEGACY_AMPLITUDE_STORAGE_KEY, "oversized");
    inner.setItem("celina-amplitude-v12", "ok");
    const storage = quotaSafeStorage(inner);

    expect(storage.getItem("celina-amplitude-v12")).toBe("ok");
    expect(inner.dump()).toEqual({ "celina-amplitude-v12": "ok" });
  });
});
