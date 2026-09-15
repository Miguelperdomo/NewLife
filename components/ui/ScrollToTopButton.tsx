"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 480;

/**
 * Botón flotante para volver al inicio de la página en textos largos
 * (Eventos, Noticias...). A la izquierda a propósito — el widget de Ayuda
 * ya ocupa la esquina inferior derecha.
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver arriba"
      title="Volver arriba"
      className={cn(
        "fixed bottom-4 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-lg shadow-slate-900/30 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:bottom-6 sm:left-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
