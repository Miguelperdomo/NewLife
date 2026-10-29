import Image from "next/image";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

// solo el ícono, sin el nombre al lado — lo usan Logo (Navbar/Footer) y el Hero
// src/alt son opcionales: si Configuración tiene logo propio se pasa, si no cae al fijo
export function LogoMark({ className, src, alt }: { className?: string; src?: string; alt?: string }) {
  return (
    <span className={cn("relative inline-block shrink-0 overflow-hidden", className)}>
      <Image
        src={src || siteConfig.logoSrc}
        alt={alt || `Logo de ${siteConfig.name}`}
        fill
        className="object-cover"
        unoptimized={Boolean(src)}
      />
    </span>
  );
}
