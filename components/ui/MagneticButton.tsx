"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const MAGNETIC_STRENGTH = 0.35;
const MAX_OFFSET_PX = 14;

// efecto "imán": el botón se desplaza hacia el cursor al acercarse y vuelve
// al salir. El movimiento se escribe directo en el DOM (sin setState) porque
// esto corre en cada mousemove y con state re-renderizaría de más.
export function MagneticButton({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    const offsetX = Math.max(-MAX_OFFSET_PX, Math.min(MAX_OFFSET_PX, x * MAGNETIC_STRENGTH));
    const offsetY = Math.max(-MAX_OFFSET_PX, Math.min(MAX_OFFSET_PX, y * MAGNETIC_STRENGTH));
    node.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  function handleMouseLeave() {
    const node = ref.current;
    if (!node) return;
    node.style.transform = "translate(0, 0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("inline-block transition-transform duration-200 ease-out motion-reduce:transition-none", className)}
    >
      {children}
    </div>
  );
}
