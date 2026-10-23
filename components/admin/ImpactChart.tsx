"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { loadBaptismRequests } from "@/lib/admin/baptismRequests";
import { loadPrayerRequests } from "@/lib/admin/prayerRequests";
import { loadVisitCheckins } from "@/lib/admin/visitCheckins";
import { cn } from "@/lib/utils";
import type { AdminSection } from "@/lib/admin/types";

const WEEKS = 4;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function hasAccess(sections: AdminSection[], section: AdminSection): boolean {
  return sections.includes("full") || sections.includes(section);
}

/** Agrupa fechas en 4 cajones de 7 días, el más reciente al final (esta semana). */
function weeklyBuckets(dates: string[], now: number): number[] {
  const buckets = new Array(WEEKS).fill(0);
  for (const date of dates) {
    const diffMs = now - new Date(date).getTime();
    const weekFromEnd = Math.floor(diffMs / WEEK_MS);
    const index = WEEKS - 1 - weekFromEnd;
    if (index >= 0 && index < WEEKS) buckets[index]++;
  }
  return buckets;
}

/** "22 oct" por cada una de las 4 semanas, de la más vieja a "esta semana" — para no depender solo de "Hace 4 semanas"/"Esta semana" en las puntas. */
function weekLabels(now: number): string[] {
  const formatter = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" });
  const labels: string[] = [];
  for (let i = WEEKS - 1; i >= 0; i--) {
    labels.push(formatter.format(new Date(now - i * WEEK_MS)));
  }
  return labels;
}

/**
 * Gráfica de barras sencilla (sin librería — solo divs con alto proporcional)
 * con Oración/Bautismo/Primera visita de las últimas 4 semanas, en vez de
 * solo los números acumulados de siempre. Reutiliza las mismas funciones de
 * carga que ya usa cada pestaña — no hay conteo nuevo del lado del servidor.
 */
export function ImpactChart({ sections }: { sections: AdminSection[] }) {
  const showPrayer = hasAccess(sections, "prayer");
  const showBaptism = hasAccess(sections, "baptism");
  const showVisits = hasAccess(sections, "visits");

  const [loading, setLoading] = useState(true);
  const [prayerWeeks, setPrayerWeeks] = useState<number[]>(new Array(WEEKS).fill(0));
  const [baptismWeeks, setBaptismWeeks] = useState<number[]>(new Array(WEEKS).fill(0));
  const [visitWeeks, setVisitWeeks] = useState<number[]>(new Array(WEEKS).fill(0));
  const [labels, setLabels] = useState<string[]>(new Array(WEEKS).fill(""));
  const [year, setYear] = useState<number | null>(null);
  // Colapsada por defecto — es un cuadro chiquito con el total, y se expande
  // a la gráfica completa solo si alguien la toca, para no ocupar tanto
  // espacio de entrada en un Dashboard que ya tiene bastante.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!showPrayer && !showBaptism && !showVisits) return;

    let cancelled = false;
    Promise.all([
      showPrayer ? loadPrayerRequests() : Promise.resolve([]),
      showBaptism ? loadBaptismRequests() : Promise.resolve([]),
      showVisits ? loadVisitCheckins() : Promise.resolve([]),
    ]).then(([prayers, baptisms, visits]) => {
      if (cancelled) return;
      const now = Date.now();
      setPrayerWeeks(weeklyBuckets(prayers.map((entry) => entry.createdAt), now));
      setBaptismWeeks(weeklyBuckets(baptisms.map((entry) => entry.createdAt), now));
      setVisitWeeks(weeklyBuckets(visits.map((entry) => entry.createdAt), now));
      setLabels(weekLabels(now));
      setYear(new Date(now).getFullYear());
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [showPrayer, showBaptism, showVisits]);

  if (!showPrayer && !showBaptism && !showVisits) return null;

  const max = Math.max(1, ...prayerWeeks, ...baptismWeeks, ...visitWeeks);
  const totalPrayer = prayerWeeks.reduce((sum, value) => sum + value, 0);
  const totalBaptism = baptismWeeks.reduce((sum, value) => sum + value, 0);
  const totalVisits = visitWeeks.reduce((sum, value) => sum + value, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h3 className="font-heading text-sm font-bold text-slate-900">
            Últimas 4 semanas{year && <span className="font-normal text-slate-400"> · {year}</span>}
          </h3>
          {!open && !loading && (
            <p className="mt-1 truncate text-xs text-slate-500">
              {[
                showPrayer && `${totalPrayer} oraciones`,
                showBaptism && `${totalBaptism} bautismos`,
                showVisits && `${totalVisits} visitas`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (loading ? (
        <p className="mt-3 text-sm text-slate-400">Cargando…</p>
      ) : (
        <>
          <div className="mt-5 flex h-28 items-end justify-between gap-4 sm:gap-6">
            {Array.from({ length: WEEKS }).map((_, week) => (
              <div key={week} className="flex h-full flex-1 items-end justify-center gap-1">
                {showPrayer && (
                  <div
                    className="w-2.5 rounded-t bg-rose-400 transition-all sm:w-3"
                    style={{ height: `${(prayerWeeks[week] / max) * 100}%` }}
                    title={`${prayerWeeks[week]} pedidos de oración`}
                  />
                )}
                {showBaptism && (
                  <div
                    className="w-2.5 rounded-t bg-sky-400 transition-all sm:w-3"
                    style={{ height: `${(baptismWeeks[week] / max) * 100}%` }}
                    title={`${baptismWeeks[week]} solicitudes de bautismo`}
                  />
                )}
                {showVisits && (
                  <div
                    className="w-2.5 rounded-t bg-emerald-400 transition-all sm:w-3"
                    style={{ height: `${(visitWeeks[week] / max) * 100}%` }}
                    title={`${visitWeeks[week]} primeras visitas`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between gap-4 text-[11px] text-slate-400 sm:gap-6">
            {labels.map((label, week) => (
              <span key={week} className="flex-1 text-center">
                {label}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
            {showPrayer && (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" aria-hidden="true" />
                Oración
              </span>
            )}
            {showBaptism && (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
                Bautismo
              </span>
            )}
            {showVisits && (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
                Primera visita
              </span>
            )}
          </div>
        </>
      ))}
    </div>
  );
}
