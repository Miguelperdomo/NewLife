"use client";

import { useCallback, useEffect, useState } from "react";
import { loadSiteSettings, resetSiteSettingsToDemo, saveSiteSettings } from "@/lib/admin/siteSettings";
import type { AdminSiteSettings } from "@/lib/admin/types";

interface SiteSettingsState {
  settings: AdminSiteSettings | null;
  isReady: boolean;
}

/**
 * Único punto de acceso a Configuración — mismo patrón que los demás hooks
 * del admin (localStorage por debajo, nada más lo toca directamente), pero
 * para un singleton en vez de una lista: no hay crear/duplicar/eliminar,
 * solo "actualizar" y "restablecer a demo".
 */
export function useAdminSiteSettings() {
  const [{ settings, isReady }, setState] = useState<SiteSettingsState>({ settings: null, isReady: false });

  useEffect(() => {
    const stored = loadSiteSettings();
    // Excepción deliberada, igual que en los otros hooks del admin:
    // localStorage no existe en el render de servidor, así que se lee una
    // sola vez tras el montaje para no romper la hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ settings: stored, isReady: true });
  }, []);

  const updateSettings = useCallback((input: Partial<AdminSiteSettings>) => {
    setState((prev) => {
      if (!prev.settings) return prev;
      const next: AdminSiteSettings = { ...prev.settings, ...input, updatedAt: new Date().toISOString() };
      saveSiteSettings(next);
      return { settings: next, isReady: true };
    });
  }, []);

  const replaceSettings = useCallback((next: AdminSiteSettings) => {
    const withTimestamp: AdminSiteSettings = { ...next, updatedAt: new Date().toISOString() };
    saveSiteSettings(withTimestamp);
    setState({ settings: withTimestamp, isReady: true });
  }, []);

  const resetToDemo = useCallback(() => {
    const fresh = resetSiteSettingsToDemo();
    setState({ settings: fresh, isReady: true });
    return fresh;
  }, []);

  return { settings, isReady, updateSettings, replaceSettings, resetToDemo };
}
