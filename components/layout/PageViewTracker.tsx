"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/publicClient";

// contador de visitas propio, sin cookies ni terceros: cada carga suma 1 en
// page_views vía increment_page_view. No reemplaza una analítica real (no filtra bots)
export function PageViewTracker() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedRef.current === pathname) return;
    lastTrackedRef.current = pathname;

    const supabase = createPublicClient();
    // silencioso a propósito: si falla, nunca debe afectar la navegación
    supabase.rpc("increment_page_view", { page_path: pathname }).then(() => {}, () => {});
  }, [pathname]);

  return null;
}
