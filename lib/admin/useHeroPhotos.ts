"use client";

import { useCallback, useEffect, useState } from "react";
import { loadHeroPhotos, saveHeroPhotos } from "@/lib/admin/heroPhotos";
import type { AdminHeroPhoto } from "@/lib/admin/types";

export function useHeroPhotos() {
  const [photos, setPhotos] = useState<AdminHeroPhoto[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadHeroPhotos().then((loaded) => {
      if (!cancelled) {
        setPhotos(loaded);
        setIsReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async (next: AdminHeroPhoto[]) => {
    await saveHeroPhotos(next);
    setPhotos(next);
  }, []);

  return { photos, isReady, save };
}
