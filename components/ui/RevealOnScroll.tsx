"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MAX_STAGGER_ITEMS = 8;
const STAGGER_STEP_MS = 70;

// fade + desplazamiento al entrar en viewport, en vez de aparecer de golpe.
// `index` mete un retraso en cascada (con tope, para que una lista larga no
// tarde una eternidad). Con reduce-motion el fade se apaga por CSS, no por
// JS, así el contenido nunca depende del IntersectionObserver para verse.
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
