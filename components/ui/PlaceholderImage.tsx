import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const toneClasses = {
  brand: "from-brand-600 via-brand-500 to-accent-500",
  accent: "from-accent-500 via-accent-400 to-brand-500",
  dark: "from-slate-900 via-brand-950 to-brand-800",
} as const;

/**
 * Bloque visual que representa una fotografía/video. Si se pasa `src`, se
 * renderiza la foto real; si no, un gradiente con el label como placeholder.
 * Así el mismo componente sirve mientras llegan los assets reales y después.
 */
export function PlaceholderImage({
  label,
  src,
  tone = "brand",
  fit = "cover",
  className,
}: {
  label: string;
  src?: string;
  tone?: keyof typeof toneClasses;
  /** "contain" evita recortar imágenes con una relación de aspecto muy distinta al contenedor. */
  fit?: "cover" | "contain";
  className?: string;
}) {
  if (src) {
    if (fit === "contain") {
      // Relación de aspecto de la imagen muy distinta a la del contenedor:
      // se ve completa, sin recortes, sobre una copia desenfocada de sí
      // misma para que no queden franjas vacías arriba/abajo.
      return (
        <div className={cn("relative overflow-hidden bg-slate-950", className)}>
          <Image
            src={src}
            alt=""
            aria-hidden="true"
            fill
            className="scale-110 object-cover opacity-40 blur-2xl"
          />
          <Image src={src} alt={label} fill className="object-contain" />
        </div>
      );
    }

    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={src} alt={label} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br text-white",
        toneClasses[tone],
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <ImageIcon className="h-8 w-8 opacity-80" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-wide opacity-90">
          {label}
        </span>
      </div>
    </div>
  );
}
