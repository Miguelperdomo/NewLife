"use client";

import { useCallback, useEffect, useState } from "react";
import { loadPastorProfile, savePastorProfile } from "@/lib/admin/pastorProfile";
import type { AdminPastorProfile } from "@/lib/admin/types";

export function usePastorProfile() {
  const [profile, setProfile] = useState<AdminPastorProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadPastorProfile().then((loaded) => {
      if (!cancelled) {
        setProfile(loaded);
        setIsReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(async (input: Omit<AdminPastorProfile, "updatedAt">) => {
    const saved = await savePastorProfile({ ...input, updatedAt: new Date().toISOString() });
    setProfile(saved);
    return saved;
  }, []);

  return { profile, isReady, update };
}
