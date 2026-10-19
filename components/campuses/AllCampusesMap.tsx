"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { resolveCampusCoordinates } from "@/lib/maps";
import type { Campus } from "@/lib/types";

// Ícono vía CDN en vez de los PNG que trae el paquete — Leaflet los referencia
// con rutas relativas que los empaquetadores (webpack/Turbopack) no resuelven
// bien, y esto evita tener que configurar ese caso especial.
const MARKER_ICON_URL = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const MARKER_SHADOW_URL = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
const MARKER_RETINA_URL = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
// Pin dorado para la sede principal (isMain) — mismo paquete de íconos de
// color que usan muchos proyectos con Leaflet, comparte la sombra de arriba.
const MARKER_ICON_URL_MAIN = "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-gold.png";
const MARKER_RETINA_URL_MAIN = "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-gold.png";

// Ciudad que se muestra de entrada cuando hay sedes en más de una — si no
// existe entre las ciudades cargadas, cae a la primera en orden alfabético.
const DEFAULT_CITY = "Ibagué";
const FALLBACK_CITY_LABEL = "Otras sedes";

/**
 * Mapa con todas las sedes a la vez — sin API key (Leaflet + OpenStreetMap,
 * gratis). Solo puede ubicar las sedes cuyo `mapQuery` ya quedó como
 * "lat,lng" (lo normal al crear la sede pegando un link de Google Maps); las
 * que tengan una dirección escrita a mano no aparecen aquí, pero sí siguen
 * mostrando su propio mapa individual en su página de sede.
 *
 * Si las sedes quedan en ciudades muy separadas (Ibagué, Girardot,
 * Bucaramanga...), mostrar todas a la vez obliga a alejar tanto el mapa que
 * cada pin se ve diminuto — por eso, en cuanto hay más de una ciudad,
 * aparece un selector arriba y el mapa se acerca solo a la ciudad elegida.
 */
export function AllCampusesMap({ campuses }: { campuses: Campus[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const pins = campuses
    .map((campus) => {
      const coords = resolveCampusCoordinates(campus.mapQuery);
      return coords ? { campus, coords } : null;
    })
    .filter((value): value is { campus: Campus; coords: { lat: number; lng: number } } => value !== null);

  // Agrupa sin importar mayúsculas/acentos de más o de menos en lo que
  // alguien escribió a mano ("Ibagué" e "ibague" caen en la misma llave) —
  // la lista de sugerencias del formulario (ver CampusForm) ya ayuda a que
  // esto casi no pase, esto es una segunda red de seguridad.
  function cityKeyOf(campus: Campus): string {
    return (campus.city?.trim() || FALLBACK_CITY_LABEL).toLowerCase();
  }

  const cityLabelByKey = new Map<string, string>();
  pins.forEach(({ campus }) => {
    const key = cityKeyOf(campus);
    if (!cityLabelByKey.has(key)) cityLabelByKey.set(key, campus.city?.trim() || FALLBACK_CITY_LABEL);
  });

  const cityKeys = Array.from(new Set(pins.map(({ campus }) => cityKeyOf(campus)))).sort((a, b) =>
    (cityLabelByKey.get(a) ?? a).localeCompare(cityLabelByKey.get(b) ?? b, "es")
  );
  const showCitySelector = cityKeys.length > 1;
  const defaultCityKey = cityKeys.find((key) => key === DEFAULT_CITY.toLowerCase()) ?? cityKeys[0] ?? null;

  const [requestedCityKey, setRequestedCityKey] = useState<string | null>(null);
  // Derivado en vez de sincronizado con un efecto: si lo que el usuario
  // seleccionó ya no existe entre las ciudades disponibles (ej. cambiaron
  // los datos), cae sola a la de por defecto en el mismo render.
  const selectedCityKey = requestedCityKey && cityKeys.includes(requestedCityKey) ? requestedCityKey : defaultCityKey;

  const visiblePins =
    showCitySelector && selectedCityKey ? pins.filter(({ campus }) => cityKeyOf(campus) === selectedCityKey) : pins;

  useEffect(() => {
    if (!containerRef.current || visiblePins.length === 0) return;

    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      const icon = L.icon({
        iconUrl: MARKER_ICON_URL,
        iconRetinaUrl: MARKER_RETINA_URL,
        shadowUrl: MARKER_SHADOW_URL,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      const mainIcon = L.icon({
        iconUrl: MARKER_ICON_URL_MAIN,
        iconRetinaUrl: MARKER_RETINA_URL_MAIN,
        shadowUrl: MARKER_SHADOW_URL,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      map = L.map(containerRef.current, { scrollWheelZoom: false });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const markers = visiblePins.map(({ campus, coords }) =>
        L.marker([coords.lat, coords.lng], { icon: campus.isMain ? mainIcon : icon })
          .addTo(map!)
          .bindTooltip(campus.isMain ? `${campus.name} · Principal` : campus.name, {
            permanent: true,
            direction: "top",
            offset: [0, -34],
            className: campus.isMain ? "campus-map-label campus-map-label--main" : "campus-map-label",
          })
      );

      if (visiblePins.length === 1) {
        map.setView([visiblePins[0].coords.lat, visiblePins[0].coords.lng], 15);
      } else {
        map.fitBounds(L.featureGroup(markers).getBounds().pad(0.2));
      }
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `visiblePins` se recalcula cada render; `selectedCityKey` ya cubre cuándo debe reconstruirse el mapa, comparar por longitud alcanza para el resto.
  }, [visiblePins.length, selectedCityKey]);

  if (pins.length === 0) return null;

  return (
    <div className="mb-10 overflow-hidden rounded-2xl border border-slate-200">
      <style>{`
        .campus-map-label {
          background: #fff;
          border: none;
          border-radius: 9999px;
          padding: 3px 10px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.2);
        }
        .campus-map-label::before {
          display: none;
        }
        .campus-map-label--main {
          background: #fde68a;
          color: #78350f;
        }
      `}</style>

      {showCitySelector && (
        <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-white px-4 py-3">
          {cityKeys.map((key) => {
            const count = pins.filter(({ campus }) => cityKeyOf(campus) === key).length;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRequestedCityKey(key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  selectedCityKey === key ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {cityLabelByKey.get(key)} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div ref={containerRef} className="h-80 w-full sm:h-96" />
      <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3">
        {visiblePins.map(({ campus }) => (
          <Link
            key={campus.slug}
            href={`/sedes/${campus.slug}`}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm shadow-slate-200 transition-colors hover:text-brand-600"
          >
            {campus.name}
            {campus.isMain && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                Principal
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
