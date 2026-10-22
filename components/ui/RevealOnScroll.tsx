"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MAX_STAGGER_ITEMS = 8;
const STAGGER_STEP_MS = 70;

/**
 * Envuelve una tarjeta (evento/ministerio/noticia) para que aparezca con un
 * leve fade + desplazamiento hacia arriba al entrar en el viewport, en vez
 * de estar ya ahí de golpe. `index` agrega un retraso en cascada para que
 * una grilla entera no aparezca toda de una vez (con tope, para que listas
 * largas no tarden una eternidad en terminar de aparecer).
 *
 * Con "prefers-reduced-motion" el fade/transform se desactiva por CSS
 * (motion-reduce:), no por JS, así el contenido nunca depende del
 * IntersectionObserver para quedar visible.
 */
export function RevealOnScroll({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const delay = Math.min(index, MAX_STAGGER_ITEMS) * STAGGER_STEP_MS;

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
