import { createJSONStorage, type StateStorage } from "zustand/middleware";

/** Previous Amplitude cache that stored every event row and can fill localStorage. */
export const LEGACY_AMPLITUDE_STORAGE_KEY = "celina-amplitude-v11";

function isQuotaError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = "name" in error ? String(error.name) : "";
  const code = "code" in error ? Number(error.code) : NaN;
  const message = "message" in error ? String(error.message) : "";
  return (
    name === "QuotaExceededError" ||
    name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    code === 22 ||
    /quota/i.test(message)
  );
}

/** localStorage writes are best-effort. A full quota must not reject a stats refresh. */
export function quotaSafeStorage(storage: StateStorage): StateStorage {
  let droppedLegacy = false;

  const dropLegacy = () => {
    if (droppedLegacy) return;
    droppedLegacy = true;
    try {
      storage.removeItem(LEGACY_AMPLITUDE_STORAGE_KEY);
    } catch {
      // Cache cleanup is best-effort.
    }
  };

  return {
    getItem: (name) => {
      dropLegacy();
      return storage.getItem(name);
    },
    setItem: (name, value) => {
      dropLegacy();
      try {
        storage.setItem(name, value);
      } catch (error) {
        if (!isQuotaError(error)) throw error;
        try {
          storage.removeItem(name);
          storage.removeItem(LEGACY_AMPLITUDE_STORAGE_KEY);
          storage.setItem(name, value);
        } catch {
          // Keep the in-memory stats if the cache cannot be written.
        }
      }
    },
    removeItem: (name) => storage.removeItem(name),
  };
}

/** Persist storage that does not throw when `window` is missing (Workers SSR). */
export const browserPersistStorage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return quotaSafeStorage(window.localStorage);
});
