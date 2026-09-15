"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createCampus as createCampusRequest,
  loadCampuses,
  removeCampus as removeCampusRequest,
  updateCampus as updateCampusRequest,
} from "@/lib/admin/campuses";
import type { AdminCampus } from "@/lib/admin/types";

type NewCampusInput = Omit<AdminCampus, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };

interface CampusState {
  campuses: AdminCampus[];
  isReady: boolean;
}

/**
 * Único punto de acceso a las sedes del admin — ahora respaldado por la
 * tabla `campuses` de Supabase. Cada mutación vuelve a pedir la lista
 * completa: es la forma más simple de reflejar de inmediato efectos
 * secundarios en OTRAS filas (ej. desmarcar la sede principal anterior al
 * marcar una nueva), sin tener que replicar esa lógica en el cliente.
 */
export function useAdminCampuses() {
  const [{ campuses, isReady }, setState] = useState<CampusState>({ campuses: [], isReady: false });

  const refresh = useCallback(async () => {
    const loaded = await loadCampuses();
    setState({ campuses: loaded, isReady: true });
    return loaded;
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadCampuses().then((loaded) => {
      if (!cancelled) setState({ campuses: loaded, isReady: true });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const createCampus = useCallback(
    async (input: NewCampusInput) => {
      const created = await createCampusRequest(
        input,
        campuses.map((campus) => campus.slug)
      );
      await refresh();
      return created;
    },
    [campuses, refresh]
  );

  const updateCampus = useCallback(
    async (id: string, input: Partial<AdminCampus>) => {
      const updated = await updateCampusRequest(id, input);
      await refresh();
      return updated;
    },
    [refresh]
  );

  const removeCampus = useCallback(
    async (id: string) => {
      await removeCampusRequest(id);
      await refresh();
    },
    [refresh]
  );

  return { campuses, isReady, createCampus, updateCampus, removeCampus };
}
