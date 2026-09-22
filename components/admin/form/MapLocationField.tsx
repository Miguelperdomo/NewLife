"use client";

import { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { Loader2, MapPin } from "lucide-react";
import type { CampusFormValues } from "@/lib/admin/schemas";
import { extractCoordinatesFromMapsUrl, googleMapsEmbedUrl, looksLikeGoogleMapsUrl } from "@/lib/maps";
import { inputClass } from "./FormField";

/**
 * Campo de ubicación con minimapa en vivo. Si lo que se pega es un link de
 * Google Maps (largo o corto — los cortos como maps.app.goo.gl se expanden
 * vía app/api/resolve-maps-link), se le sacan las coordenadas y esas quedan
 * como el valor real guardado (más confiable para el mapa público que el
 * link entero). Si es una dirección escrita a mano, se deja tal cual — ya
 * funcionaba antes. El mapa de abajo se actualiza solo, para que la persona
 * confirme visualmente ANTES de guardar que el punto es el correcto.
 */
export function MapLocationField({ control }: { control: Control<CampusFormValues> }) {
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  return (
    <Controller
      control={control}
      name="mapQuery"
      render={({ field }) => {
        async function handleBlur() {
          field.onBlur();
          const value = field.value.trim();
          if (!value || !looksLikeGoogleMapsUrl(value)) return;

          setResolveError(null);
          setResolving(true);
          try {
            let finalUrl = value;
            const parsed = new URL(value);
            if (parsed.hostname === "maps.app.goo.gl" || parsed.hostname === "goo.gl") {
              const response = await fetch(`/api/resolve-maps-link?url=${encodeURIComponent(value)}`);
              const data = await response.json();
              if (response.ok && data.url) finalUrl = data.url;
            }

            const coords = extractCoordinatesFromMapsUrl(finalUrl);
            if (coords) {
              field.onChange(coords);
            } else {
              setResolveError(
                "No pudimos leer las coordenadas exactas de ese link. Revisa el mapa de abajo — si no muestra tu sede, prueba pegando la dirección escrita en vez del link."
              );
            }
          } catch {
            setResolveError("No se pudo abrir ese link. Prueba pegando la dirección escrita.");
          } finally {
            setResolving(false);
          }
        }

        const previewQuery = field.value?.trim();

        return (
          <div className="space-y-3">
            <div className="relative">
              <input
                id="mapQuery"
                className={inputClass}
                placeholder="Pega el link de Google Maps, o escribe la dirección"
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={handleBlur}
              />
              {resolving && (
                <Loader2
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400"
                  aria-hidden="true"
                />
              )}
            </div>

            {resolveError && <p className="text-xs font-medium text-amber-600">{resolveError}</p>}

            {previewQuery && (
              <div>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <iframe
                    key={previewQuery}
                    src={googleMapsEmbedUrl(previewQuery)}
                    className="h-56 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vista previa de la ubicación"
                  />
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Verifica que el mapa de arriba muestre tu sede antes de guardar.
                </p>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
