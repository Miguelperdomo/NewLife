import Image from "next/image";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Solo el ícono del logo (sin el nombre al lado). Reutilizado por `Logo`
 * (Navbar/Footer) y por secciones que necesitan el logo solo, como el Hero.
 * `src`/`alt` son opcionales: cuando Configuración tiene un logo propio
 * guardado, el llamador se lo pasa; si no, cae al logo fijo de siempre.
 */
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
