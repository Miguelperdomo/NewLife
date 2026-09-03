"use client";

import { useCallback, useEffect, useState } from "react";
import { loadMinistryStore, saveMinistryStore } from "@/lib/admin/ministries";
import { slugify, uniqueSlug } from "@/lib/admin/slug";
import type { AdminMinistry } from "@/lib/admin/types";

type NewMinistryInput = Omit<AdminMinistry, "id" | "createdAt" | "updatedAt">;

interface MinistryState {
  ministries: AdminMinistry[];
  isReady: boolean;
}

/**
 * Único punto de acceso a los ministerios del admin — mismo patrón que
 * useAdminContent.ts/useAdminCampuses.ts (localStorage por debajo, nada más
 * lo toca directamente). No se elimina físicamente: solo archivar/activar,
 * igual que Eventos/Noticias.
 */
export function useAdminMinistries() {
  const [{ ministries, isReady }, setState] = useState<MinistryState>({ ministries: [], isReady: false });

  useEffect(() => {
    const stored = loadMinistryStore();
    // Excepción deliberada, igual que en los otros hooks del admin:
    // localStorage no existe en el render de servidor, así que se lee una
    // sola vez tras el montaje para no romper la hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ ministries: stored, isReady: true });
  }, []);

  const persist = useCallback((next: AdminMinistry[]) => {
    setState({ ministries: next, isReady: true });
    saveMinistryStore(next);
  }, []);

  const createMinistry = useCallback(
    (input: NewMinistryInput) => {
      const now = new Date().toISOString();
      const slug = uniqueSlug(
        input.slug || slugify(input.name),
        ministries.map((ministry) => ministry.slug),
        "ministerio"
      );
      const ministry: AdminMinistry = { ...input, id: crypto.randomUUID(), slug, createdAt: now, updatedAt: now };
      persist([ministry, ...ministries]);
      return ministry;
    },
    [ministries, persist]
  );

  const updateMinistry = useCallback(
    (id: string, input: Partial<AdminMinistry>) => {
      const now = new Date().toISOString();
      persist(
        ministries.map((ministry) => {
          if (ministry.id !== id) return ministry;
          // Si el slug cambió a mano, sigue garantizando que quede único
          // frente al resto — mismo mecanismo que al crear.
          const nextSlug =
            input.slug && input.slug !== ministry.slug
              ? uniqueSlug(
                  input.slug,
                  ministries.filter((item) => item.id !== id).map((item) => item.slug),
                  "ministerio"
                )
              : ministry.slug;
          return { ...ministry, ...input, id: ministry.id, slug: nextSlug, updatedAt: now };
        })
      );
    },
    [ministries, persist]
  );

  const duplicateMinistry = useCallback(
    (id: string) => {
      const original = ministries.find((ministry) => ministry.id === id);
      if (!original) return undefined;
      const now = new Date().toISOString();
      const slug = uniqueSlug(
        `${original.slug}-copia`,
        ministries.map((ministry) => ministry.slug),
        "ministerio"
      );
      const copy: AdminMinistry = {
        ...original,
        id: crypto.randomUUID(),
        slug,
        name: `${original.name} (copia)`,
        // Sin estado "draft" en este módulo (solo active/archived) — una
        // copia recién creada arranca archivada, análogo al "draft" que
        // usan las copias de eventos/noticias.
        status: "archived",
        createdAt: now,
        updatedAt: now,
      };
      persist([copy, ...ministries]);
      return copy;
    },
    [ministries, persist]
  );

  const archiveMinistry = useCallback(
    (id: string) => updateMinistry(id, { status: "archived" }),
    [updateMinistry]
  );

  const activateMinistry = useCallback(
    (id: string) => updateMinistry(id, { status: "active" }),
    [updateMinistry]
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
