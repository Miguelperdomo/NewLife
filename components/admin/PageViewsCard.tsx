"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { loadPageViews, type PageViewRow } from "@/lib/admin/pageViews";

const FRIENDLY_LABELS: Record<string, string> = {
  "/": "Inicio",
  "/nosotros": "Conócenos",
  "/ministerios": "Ministerios",
  "/eventos": "Eventos",
  "/noticias": "Noticias",
  "/sedes": "Sedes",
  "/pastores": "Apóstol",
};

const MAX_ROWS = 8;

/**
 * Contador de visitas propio — solo cuenta cargas de página por ruta (tabla
 * `page_views`, sumada por components/layout/PageViewTracker.tsx en cada
 * visita pública). No es Google Analytics: no distingue bots de personas
 * reales, ni país, ni dispositivo — es a propósito lo más simple posible.
 */
export function PageViewsCard() {
  const [rows, setRows] = useState<PageViewRow[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadPageViews().then((loaded) => {
      if (!cancelled) {
        setRows(loaded);
        setIsReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = rows.reduce((sum, row) => sum + row.viewCount, 0);
  const topRows = rows.slice(0, MAX_ROWS);
  const maxCount = topRows[0]?.viewCount ?? 1;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-slate-900">
          <BarChart3 className="h-4 w-4 text-slate-400" aria-hidden="true" />
          Visitas del sitio
        </h2>
        {isReady && <span className="text-sm font-semibold text-slate-500">{total} en total</span>}
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Conteo simple por página — no mide quién es cada visitante, ni filtra bots/buscadores.
      </p>

      {!isReady ? (
        <p className="mt-4 text-sm text-slate-400">Cargando…</p>
      ) : topRows.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
          Todavía no hay visitas registradas.
        </p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {topRows.map((row) => (
            <li key={row.path}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-slate-600">{FRIENDLY_LABELS[row.path] ?? row.path}</span>
                <span className="shrink-0 font-semibold text-slate-900">{row.viewCount}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${Math.max(4, (row.viewCount / maxCount) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      {rows.length > MAX_ROWS && (
        <p className="mt-3 text-xs text-slate-400">y {rows.length - MAX_ROWS} página(s) más.</p>
      )}
    </div>
  );
}
