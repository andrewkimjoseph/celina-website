import { useEffect, useState } from "react";
import { useNpmStore } from "./npm-store";

export function useNpmHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useNpmStore.persist;
    if (!persist) {
      setHydrated(true);
      return;
    }
    setHydrated(persist.hasHydrated());
    return persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
