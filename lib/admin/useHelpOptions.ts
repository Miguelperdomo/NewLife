"use client";

import { useCallback, useEffect, useState } from "react";
import { loadHelpOptions, saveHelpOptions } from "@/lib/admin/helpOptions";
import type { AdminHelpOption } from "@/lib/admin/types";

export function useHelpOptions() {
  const [options, setOptions] = useState<AdminHelpOption[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadHelpOptions().then((loaded) => {
      if (!cancelled) {
        setOptions(loaded);
        setIsReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async (next: AdminHelpOption[]) => {
    await saveHelpOptions(next);
    setOptions(next);
  }, []);

  return { options, isReady, save };
}
