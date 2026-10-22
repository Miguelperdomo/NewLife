"use client";

import { usePathname } from "next/navigation";

/**
 * Fundido corto al entrar a cada página, en vez del corte seco de antes.
 * Versión simple a propósito (CSS puro, sin librería de animación): el
 * `key={pathname}` hace que React vuelva a montar este div en cada cambio de
 * ruta, lo que por sí solo reinicia la animación de @keyframes — no hace
 * falta manejar estados de "saliendo/entrando" con JavaScript, que es donde
 * este tipo de transición suele romperse con Server Components.
 */
export function PageFadeIn({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-fade-in">
      {children}
    </div>
  );
}
