import { cn } from "@/lib/utils";

const BAR_DELAYS_MS = [-900, -500, -200, -700];
const BAR_DURATIONS_MS = [800, 1000, 700, 900];

/**
 * Indicador de "transmisiones en vivo". Deliberadamente NO dice "estamos en
 * vivo" — la iglesia no transmite todo el tiempo. Cuando exista integración
 * con la YouTube API para detectar un directo activo, este componente puede
 * cambiar de texto/estado sin tocar dónde se usa.
 *
 * Las barras tipo ecualizador (en vez de solo un punto parpadeando) imitan
 * el visualizador de audio de las plataformas de streaming grandes.
 */
export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-500",
        className
      )}
    >
      <span className="flex h-2.5 items-end gap-0.5" aria-hidden="true">
        {BAR_DELAYS_MS.map((delay, i) => (
          <span
            key={i}
            className="eq-bar h-full w-0.5 rounded-full bg-red-500"
            style={{ animationDelay: `${delay}ms`, animationDuration: `${BAR_DURATIONS_MS[i]}ms` }}
          />
        ))}
      </span>
      Transmisiones en vivo
    </span>
  );
}
