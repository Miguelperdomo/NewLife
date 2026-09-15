"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createMinistry as createMinistryRequest,
  duplicateMinistry as duplicateMinistryRequest,
  loadMinistries,
  setMinistryStatus,
  updateMinistry as updateMinistryRequest,
} from "@/lib/admin/ministries";
import type { AdminMinistry } from "@/lib/admin/types";

type NewMinistryInput = Omit<AdminMinistry, "id" | "createdAt" | "updatedAt">;

interface MinistryState {
  ministries: AdminMinistry[];
  isReady: boolean;
}

/**
 * Único punto de acceso a los ministerios del admin — ahora respaldado por
 * la tabla `ministries` de Supabase. Mismo patrón que useAdminCampuses.ts:
 * cada mutación vuelve a pedir la lista completa.
 */
export function useAdminMinistries() {
  const [{ ministries, isReady }, setState] = useState<MinistryState>({ ministries: [], isReady: false });

  const refresh = useCallback(async () => {
    const loaded = await loadMinistries();
    setState({ ministries: loaded, isReady: true });
    return loaded;
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadMinistries().then((loaded) => {
      if (!cancelled) setState({ ministries: loaded, isReady: true });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const createMinistry = useCallback(
    async (input: NewMinistryInput) => {
      const created = await createMinistryRequest(
        input,
        ministries.map((ministry) => ministry.slug)
      );
      await refresh();
      return created;
    },
    [ministries, refresh]
  );

  const updateMinistry = useCallback(
    async (id: string, input: Partial<AdminMinistry>) => {
      const current = ministries.find((ministry) => ministry.id === id);
      const otherSlugs = ministries.filter((ministry) => ministry.id !== id).map((ministry) => ministry.slug);
      const updated = await updateMinistryRequest(id, input, current?.slug ?? "", otherSlugs);
      await refresh();
      return updated;
    },
    [ministries, refresh]
  );

  const duplicateMinistry = useCallback(
    async (id: string) => {
      const original = ministries.find((ministry) => ministry.id === id);
      if (!original) return undefined;
      const created = await duplicateMinistryRequest(
        original,
        ministries.map((ministry) => ministry.slug)
      );
      await refresh();
      return created;
    },
    [ministries, refresh]
  );

  const archiveMinistry = useCallback(
    async (id: string) => {
      await setMinistryStatus(id, "archived");
      await refresh();
    },
    [refresh]
  );

  const activateMinistry = useCallback(
    async (id: string) => {
      await setMinistryStatus(id, "active");
      await refresh();
    },
    [refresh]
  );

  return {
    ministries,
    isReady,
    createMinistry,
    updateMinistry,
    duplicateMinistry,
    archiveMinistry,
    activateMinistry,
  };
}
