"use client";

import { useCallback, useEffect, useState } from "react";
import { loadSiteSettings, resetSiteSettingsToDemo, saveSiteSettings } from "@/lib/admin/siteSettings";
import type { AdminSiteSettings } from "@/lib/admin/types";

interface SiteSettingsState {
  settings: AdminSiteSettings | null;
  isReady: boolean;
}

/**
 * Único punto de acceso a Configuración — ahora respaldado por la tabla
 * `site_settings` de Supabase (singleton) en vez de localStorage. Mismo
 * patrón que antes (nada más toca la capa de datos directamente), solo que
 * cargar/guardar ahora es asíncrono.
 */
export function useAdminSiteSettings() {
  const [{ settings, isReady }, setState] = useState<SiteSettingsState>({ settings: null, isReady: false });

  useEffect(() => {
    let cancelled = false;
    loadSiteSettings().then((loaded) => {
      if (!cancelled) setState({ settings: loaded, isReady: true });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback(
    async (input: Partial<AdminSiteSettings>) => {
      if (!settings) return;
      const next: AdminSiteSettings = { ...settings, ...input, updatedAt: new Date().toISOString() };
      const saved = await saveSiteSettings(next);
      setState({ settings: saved, isReady: true });
    },
    [settings]
  );

  const replaceSettings = useCallback(async (next: AdminSiteSettings) => {
    const withTimestamp: AdminSiteSettings = { ...next, updatedAt: new Date().toISOString() };
    const saved = await saveSiteSettings(withTimestamp);
    setState({ settings: saved, isReady: true });
  }, []);

  const resetToDemo = useCallback(async () => {
    const fresh = await resetSiteSettingsToDemo();
    setState({ settings: fresh, isReady: true });
    return fresh;
  }, []);

  return { settings, isReady, updateSettings, replaceSettings, resetToDemo };
}
