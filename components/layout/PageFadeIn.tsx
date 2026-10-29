"use client";

import { usePathname } from "next/navigation";

// fundido corto al entrar a cada página. key={pathname} hace que React remonte
// el div en cada cambio de ruta, lo que reinicia la animación solo — sin JS extra
export function PageFadeIn({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-fade-in">
      {children}
    </div>
  );
}
