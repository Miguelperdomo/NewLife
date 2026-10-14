"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/publicClient";

/**
 * Contador de visitas propio y simple — sin cookies, sin terceros, sin datos
 * personales: cada carga de página solo suma 1 al contador de esa ruta en
 * Supabase (tabla `page_views`, vía la función `increment_page_view`). No
 * reemplaza una herramienta real de analítica (no filtra bots, no mide
 * tiempo en pantalla) — es a propósito lo más simple posible.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;

    const supabase = createPublicClient();
    // Silencioso a propósito: si falla (ej. sin conexión, o la función SQL
    // todavía no se creó), nunca debe afectar la navegación de quien visita.
    supabase.rpc("increment_page_view", { page_path: pathname }).then(() => {}, () => {});
  }, [pathname]);

  return null;
}
