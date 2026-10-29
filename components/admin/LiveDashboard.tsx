"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2, Radio } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField, inputClass } from "@/components/admin/form/FormField";
import { ImageUploadField } from "@/components/admin/form/ImageUploadField";
import { useAdminSiteSettings } from "@/lib/admin/useAdminSiteSettings";
import { useLiveStatus } from "@/lib/useLiveStatus";
import { liveSettingsFormSchema, type LiveSettingsFormValues } from "@/lib/admin/schemas";
import { cn } from "@/lib/utils";

/**
 * Página propia (en vez de un campo escondido dentro de Configuración) para
 * que quien tenga que activar "en vivo" justo antes de un servicio lo
 * encuentre de una en el menú, sin tener que ir a buscarlo.
 */
export function LiveDashboard() {
  const { settings, isReady, updateSettings } = useAdminSiteSettings();
  const autoStatus = useLiveStatus();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<LiveSettingsFormValues>({
    resolver: zodResolver(liveSettingsFormSchema),
    defaultValues: { isLiveManual: false, liveThumbnailUrl: "", liveThumbnailAlt: "" },
  });

  useEffect(() => {
    if (!settings) return;
    reset({
      isLiveManual: settings.isLiveManual,
      liveThumbnailUrl: settings.liveThumbnailUrl ?? "",
      liveThumbnailAlt: settings.liveThumbnailAlt ?? "",
    });
  }, [settings, reset]);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timeout);
  }, [saved]);

  async function onSubmit(values: LiveSettingsFormValues) {
    setSaveError(null);
    try {
      await updateSettings(values);
      setSaved(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "No se pudo guardar.");
    }
  }

  const isLiveNow = Boolean(settings?.isLiveManual) || autoStatus.isLive;

  return (
    <div className="space-y-6">
      {(saved || saveError) && (
        <div className="fixed bottom-6 right-6 z-50 animate-page-fade-in">
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg",
              saved ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"
            )}
          >
            {saved && <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
            {saved ? "Guardado correctamente." : saveError}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-heading text-xl font-bold text-slate-900">En vivo</h2>
        <p className="mt-1 text-sm text-slate-500">
          Controla cuándo el Inicio muestra el banner de transmisión en vivo, de primero, antes que cualquier otra
          cosa.
        </p>
      </div>

      {!isReady ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Cargando…
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div
            className={cn(
              "flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
              isLiveNow ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  isLiveNow ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400"
                )}
              >
                <Radio className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-heading text-sm font-bold text-slate-900">
                  {isLiveNow ? "Sí, el sitio está mostrando el banner de en vivo" : "No, el sitio no está en modo en vivo"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {autoStatus.isLive
                    ? "Detectado automático desde YouTube ahora mismo."
                    : "Sin detección automática activa — depende del interruptor de abajo."}
                </p>
              </div>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
              <input id="isLiveManual" type="checkbox" className="h-4 w-4 rounded" {...register("isLiveManual")} />
              Sí, estamos transmitiendo
            </label>
          </div>

          <p className="text-xs text-slate-400">
            Actívalo justo cuando empiece la transmisión y desactívalo al terminar. Si ya configuraste las claves de
            YouTube, el sitio también lo detecta solo — cualquiera de los dos activa el banner.
          </p>

          <FormField
            label="Imagen"
            htmlFor="liveThumbnailUrl"
            hint="Opcional — si no la pones, se usa la miniatura del video de YouTube en vivo (o una imagen genérica si tampoco hay eso)."
          >
            <ImageUploadField control={control} name="liveThumbnailUrl" folder="settings" />
          </FormField>

          <FormField label="Texto alternativo" htmlFor="liveThumbnailAlt" hint="Describe la imagen, para accesibilidad.">
            <input id="liveThumbnailAlt" className={inputClass} {...register("liveThumbnailAlt")} />
          </FormField>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
