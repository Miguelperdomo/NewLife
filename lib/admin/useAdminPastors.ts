"use client";

import { useCallback, useEffect, useState } from "react";
import { loadPastorStore, savePastorStore } from "@/lib/admin/pastors";
import { slugify, uniqueSlug } from "@/lib/admin/slug";
import type { AdminPastor } from "@/lib/admin/types";

type NewPastorInput = Omit<AdminPastor, "id" | "createdAt" | "updatedAt">;

interface PastorState {
  pastors: AdminPastor[];
  isReady: boolean;
}

/**
 * Único punto de acceso a los pastores del admin — mismo patrón que
 * useAdminMinistries.ts (localStorage por debajo, nada más lo toca
 * directamente). No se elimina físicamente: solo archivar/activar.
 */
export function useAdminPastors() {
  const [{ pastors, isReady }, setState] = useState<PastorState>({ pastors: [], isReady: false });

  useEffect(() => {
    const stored = loadPastorStore();
    // Excepción deliberada, igual que en los otros hooks del admin:
    // localStorage no existe en el render de servidor, así que se lee una
    // sola vez tras el montaje para no romper la hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ pastors: stored, isReady: true });
  }, []);

  const persist = useCallback((next: AdminPastor[]) => {
    setState({ pastors: next, isReady: true });
    savePastorStore(next);
  }, []);

  const createPastor = useCallback(
    (input: NewPastorInput) => {
      const now = new Date().toISOString();
      const slug = uniqueSlug(
        input.slug || slugify(input.name),
        pastors.map((pastor) => pastor.slug),
        "pastor"
      );
      const pastor: AdminPastor = { ...input, id: crypto.randomUUID(), slug, createdAt: now, updatedAt: now };
      persist([pastor, ...pastors]);
      return pastor;
    },
    [pastors, persist]
  );

  const updatePastor = useCallback(
    (id: string, input: Partial<AdminPastor>) => {
      const now = new Date().toISOString();
      persist(
        pastors.map((pastor) => {
          if (pastor.id !== id) return pastor;
          const nextSlug =
            input.slug && input.slug !== pastor.slug
              ? uniqueSlug(
                  input.slug,
                  pastors.filter((item) => item.id !== id).map((item) => item.slug),
                  "pastor"
                )
              : pastor.slug;
          return { ...pastor, ...input, id: pastor.id, slug: nextSlug, updatedAt: now };
        })
      );
    },
    [pastors, persist]
  );

  const duplicatePastor = useCallback(
    (id: string) => {
      const original = pastors.find((pastor) => pastor.id === id);
      if (!original) return undefined;
      const now = new Date().toISOString();
      const slug = uniqueSlug(`${original.slug}-copia`, pastors.map((pastor) => pastor.slug), "pastor");
      const copy: AdminPastor = {
        ...original,
        id: crypto.randomUUID(),
        slug,
        name: `${original.name} (copia)`,
        status: "archived",
        createdAt: now,
        updatedAt: now,
      };
      persist([copy, ...pastors]);
      return copy;
    },
    [pastors, persist]
  );

  const archivePastor = useCallback((id: string) => updatePastor(id, { status: "archived" }), [updatePastor]);
  const activatePastor = useCallback((id: string) => updatePastor(id, { status: "active" }), [updatePastor]);

  return {
    pastors,
    isReady,
    createPastor,
    updatePastor,
    duplicatePastor,
    archivePastor,
    activatePastor,
  };
}
