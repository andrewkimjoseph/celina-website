import { useEffect, useState } from "react";
import { useNpmStore } from "./npm-store";

export function useNpmHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useNpmStore.persist.hasHydrated());

  useEffect(() => {
    setHydrated(useNpmStore.persist.hasHydrated());
    return useNpmStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
