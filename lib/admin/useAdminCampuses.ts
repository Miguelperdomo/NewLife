"use client";

import { useCallback, useEffect, useState } from "react";
import { loadCampusStore, saveCampusStore } from "@/lib/admin/storage";
import { slugify, uniqueSlug } from "@/lib/admin/slug";
import type { AdminCampus } from "@/lib/admin/types";

type NewCampusInput = Omit<AdminCampus, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };

interface CampusState {
  campuses: AdminCampus[];
  isReady: boolean;
}

/**
 * Único punto de acceso a las sedes del admin — mismo patrón que
 * useAdminContent.ts (localStorage por debajo, nada más lo toca
 * directamente). Aquí sí se elimina de verdad (sin "archivar"): a diferencia
 * de eventos/noticias, una sede no tiene estado editorial.
 */
export function useAdminCampuses() {
  const [{ campuses, isReady }, setState] = useState<CampusState>({ campuses: [], isReady: false });

  useEffect(() => {
    const stored = loadCampusStore();
    // Excepción deliberada, igual que en useAdminContent: localStorage no
    // existe en el render de servidor, así que se lee una sola vez tras el
    // montaje para no romper la hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ campuses: stored, isReady: true });
  }, []);

  const persist = useCallback((next: AdminCampus[]) => {
    setState({ campuses: next, isReady: true });
    saveCampusStore(next);
  }, []);

  const createCampus = useCallback(
    (input: NewCampusInput) => {
      const now = new Date().toISOString();
      const slug = uniqueSlug(
        input.slug || slugify(input.name),
        campuses.map((campus) => campus.slug),
        "sede"
      );
      const campus: AdminCampus = { ...input, id: crypto.randomUUID(), slug, createdAt: now, updatedAt: now };
      // Solo puede haber una "sede principal" a la vez.
      const rest = input.isMain ? campuses.map((existing) => ({ ...existing, isMain: false })) : campuses;
      persist([campus, ...rest]);
      return campus;
    },
    [campuses, persist]
  );

  const updateCampus = useCallback(
    (id: string, input: Partial<AdminCampus>) => {
      const now = new Date().toISOString();
      const makingMain = input.isMain === true;
      persist(
        campuses.map((campus) => {
          if (campus.id === id) return { ...campus, ...input, id: campus.id, updatedAt: now };
          return makingMain ? { ...campus, isMain: false } : campus;
        })
      );
    },
    [campuses, persist]
  );

  const removeCampus = useCallback(
    (id: string) => {
      persist(campuses.filter((campus) => campus.id !== id));
    },
    [campuses, persist]
  );

  return { campuses, isReady, createCampus, updateCampus, removeCampus };
}
