"use client";

import { useEffect } from "react";

/**
 * Aviso nativo del navegador al cerrar la pestaña/recargar/volver atrás con
 * cambios sin guardar en un formulario (`isDirty` de React Hook Form). El
 * texto exacto del aviso lo pone el propio navegador — por seguridad, ningún
 * sitio puede personalizarlo, así que `event.returnValue` solo lo activa.
 *
 * Cubre cerrar/recargar la pestaña y el gesto de "atrás" del navegador/celular
 * — no cubre hacer clic en otro enlace DENTRO del panel (ej. otro ítem del
 * menú lateral), que necesitaría interceptar cada navegación manualmente.
 */
export function useUnsavedChangesWarning(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
}
