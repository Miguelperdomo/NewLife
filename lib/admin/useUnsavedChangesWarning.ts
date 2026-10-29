"use client";

import { useEffect } from "react";

// Aviso nativo del navegador al cerrar/recargar/volver atrás con cambios
// sin guardar (isDirty de RHF). El texto lo pone el navegador, ningún sitio
// puede personalizarlo, así que returnValue solo lo activa.
// No cubre un clic en otro link DENTRO del panel, eso necesitaría
// interceptar cada navegación a mano.
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
