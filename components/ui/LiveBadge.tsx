import { cn } from "@/lib/utils";

/**
 * Indicador de "transmisiones en vivo". Deliberadamente NO dice "estamos en
 * vivo" — la iglesia no transmite todo el tiempo. Cuando exista integración
 * con la YouTube API para detectar un directo activo, este componente puede
 * cambiar de texto/estado sin tocar dónde se usa.
 */
export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-500",
        className
      )}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
      </span>
      Transmisiones en vivo
    </span>
  );
}
