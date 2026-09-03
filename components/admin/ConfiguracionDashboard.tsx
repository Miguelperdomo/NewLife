"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { siteSettingsFormValuesToInput, siteSettingsToFormValues } from "@/lib/admin/mappers";
import { useAdminSiteSettings } from "@/lib/admin/useAdminSiteSettings";
import type { SiteSettingsFormValues } from "@/lib/admin/schemas";
import { CreditsPanel } from "./CreditsPanel";
import { SiteSettingsForm } from "./SiteSettingsForm";
import { SystemPanel } from "./SystemPanel";

export function ConfiguracionDashboard() {
  const { settings, isReady, updateSettings, replaceSettings, resetToDemo } = useAdminSiteSettings();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timeout);
  }, [saved]);

  function handleSubmit(values: SiteSettingsFormValues) {
    updateSettings(siteSettingsFormValuesToInput(values));
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Configuración guardada correctamente.
        </div>
      )}

      <div>
        <h2 className="font-heading text-xl font-bold text-slate-900">Configuración</h2>
        <p className="mt-1 text-sm text-slate-500">
          Controla los datos generales de New Life — identidad, colores, redes, WhatsApp y qué secciones se
          muestran en el Home — sin tocar código.
        </p>
      </div>

      {isReady && settings ? (
        <>
          {/* La key fuerza a que el formulario se reinicialice con los
              valores frescos cada vez que la configuración cambia desde
              fuera del propio formulario (ej. "Restablecer contenido demo"
              o "Importar configuración" en SystemPanel). */}
          <SiteSettingsForm key={settings.updatedAt} defaultValues={siteSettingsToFormValues(settings)} onSubmit={handleSubmit} />

          <SystemPanel settings={settings} onResetDemo={resetToDemo} onImport={replaceSettings} />

          <CreditsPanel />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Cargando configuración…
        </p>
      )}
    </div>
  );
}
