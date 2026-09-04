import { createJSONStorage } from "zustand/middleware";

/** Persist storage that does not throw when `window` is missing (Workers SSR). */
export const browserPersistStorage = createJSONStorage(() => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return window.localStorage;
});
