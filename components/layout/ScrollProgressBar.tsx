"use client";

import { useEffect, useState } from "react";

/** Línea delgada debajo del menú que se llena según cuánto has bajado en la página. */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    // top-[2px] para no encimarse con RouteProgressBar que está en top-0
    <div className="pointer-events-none fixed inset-x-0 top-[2px] z-[59] h-0.5 bg-transparent">
      <div className="h-full bg-brand-300/80 transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
    </div>
  );
}
