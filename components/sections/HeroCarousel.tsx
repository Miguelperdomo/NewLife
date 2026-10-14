"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroPhoto } from "@/lib/types";

const INTERVAL_MS = 6000;

/**
 * Fondo de la portada cuando hay fotos reales subidas en Configuración.
 * Con una sola foto se queda fija; con 2+ rota sola con un fundido, sin
 * botones ni controles (es decorativo, no un carrusel que alguien navegue).
 * Respeta "reduce motion": ahí simplemente se queda en la primera foto.
 */
export function HeroCarousel({ photos }: { photos: HeroPhoto[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % photos.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [photos.length]);

  return (
    <div className="absolute inset-0 h-full w-full">
      {photos.map((photo, i) => (
        <div
          key={`${photo.src}-${i}`}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
            i === index ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={photo.src}
            alt={photo.alt || ""}
            fill
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
