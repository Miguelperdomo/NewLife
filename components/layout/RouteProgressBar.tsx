"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Barra delgada de progreso al navegar entre páginas (como YouTube/Notion) —
 * puramente de percepción, no mide el avance real de la carga. Arranca al
 * detectar un click en un link interno (captura en el documento, para no
 * tener que tocar cada <Link> del sitio) y se completa cuando cambia la ruta
 * (usePathname), que es el único momento en que el App Router confirma que
 * la navegación terminó.
 */
// Tope de seguridad: si por lo que sea nunca llega la confirmación de que la
// ruta cambió (ej. un link a la misma página con distinto query string, que
// no dispara usePathname()), la barra igual se completa sola en vez de
// quedarse pegada a medio camino para siempre.
const MAX_DURATION_MS = 4000;

export function RouteProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathnameRef = useRef(pathname);

  function finish() {
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);
    setProgress(100);
    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  }

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (/^https?:\/\//.test(href) && !href.startsWith(window.location.origin)) return;
      if (href === `${window.location.pathname}${window.location.search}`) return;

      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (maxTimeoutRef.current) clearTimeout(maxTimeoutRef.current);

      setVisible(true);
      setProgress(15);
      stepTimeoutRef.current = setTimeout(() => setProgress(70), 250);
      maxTimeoutRef.current = setTimeout(finish, MAX_DURATION_MS);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;
    finish();

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed left-0 top-0 z-[60] h-0.5 bg-brand-600 motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
        progress === 100 ? "transition-[width,opacity] duration-200 ease-out" : "transition-[width,opacity] duration-300 ease-out"
      )}
      style={{ width: `${progress}%` }}
    />
  );
}
