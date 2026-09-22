"use client";

import { useEffect, useRef, useState } from "react";
import { Contrast, Type } from "lucide-react";

type TextScale = "1" | "2" | "3";

const TEXT_SCALE_KEY = "newlife-text-scale";
const CONTRAST_KEY = "newlife-a11y-contrast";

/**
 * Menú de accesibilidad del sitio público — tamaño de texto (3 pasos) y
 * alto contraste. Pensado para adultos mayores de la congregación con
 * dificultad para leer letra pequeña. La preferencia se guarda en el propio
 * navegador de quien visita (localStorage) — no le llega a nadie más ni se
 * puede leer desde el panel admin, es solo una comodidad de ese visitante.
 */
export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [textScale, setTextScale] = useState<TextScale>("1");
  const [contrast, setContrast] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Se lee guardado solo después de montar (localStorage no existe en el
  // servidor) — evita el error de hidratación de leerlo durante el render.
  useEffect(() => {
    // Excepción deliberada, igual que en HelpWidget: localStorage no existe
    // en el render de servidor, así que se lee una sola vez tras el montaje.
    try {
      const savedScale = localStorage.getItem(TEXT_SCALE_KEY);
      if (savedScale === "1" || savedScale === "2" || savedScale === "3") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTextScale(savedScale);
      }
      const savedContrast = localStorage.getItem(CONTRAST_KEY);
      if (savedContrast === "true") {
        setContrast(true);
      }
    } catch {
      // Privado/bloqueado: se queda en los valores por defecto, sin romper nada.
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-text-scale", textScale);
    try {
      localStorage.setItem(TEXT_SCALE_KEY, textScale);
    } catch {
      // Silencioso — ver comentario de arriba.
    }
  }, [textScale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-a11y-contrast", String(contrast));
    try {
      localStorage.setItem(CONTRAST_KEY, String(contrast));
    } catch {
      // Silencioso — ver comentario de arriba.
    }
  }, [contrast]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Opciones de accesibilidad"
        title="Accesibilidad"
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-700"
      >
        <Type className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/10"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tamaño de texto</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(
              [
                { value: "1", label: "A", title: "Normal" },
                { value: "2", label: "A+", title: "Grande" },
                { value: "3", label: "A++", title: "Muy grande" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTextScale(option.value)}
                aria-pressed={textScale === option.value}
                className={`rounded-lg border px-2 py-2 text-sm font-semibold transition-colors ${
                  textScale === option.value
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <span className="flex items-center gap-2 text-sm text-slate-700">
              <Contrast className="h-4 w-4 text-slate-400" aria-hidden="true" />
              Alto contraste
            </span>
            <input
              type="checkbox"
              checked={contrast}
              onChange={(event) => setContrast(event.target.checked)}
              className="h-4 w-4 rounded"
            />
          </label>
        </div>
      )}
    </div>
  );
}
