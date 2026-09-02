import Image from "next/image";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Solo el ícono del logo (sin el nombre al lado). Reutilizado por `Logo`
 * (Navbar/Footer) y por secciones que necesitan el logo solo, como el Hero.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block shrink-0 overflow-hidden", className)}>
      <Image
        src={siteConfig.logoSrc}
        alt={`Logo de ${siteConfig.name}`}
        fill
        className="object-cover"
      />
    </span>
  );
}
