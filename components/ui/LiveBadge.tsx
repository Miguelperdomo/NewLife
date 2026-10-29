import { cn } from "@/lib/utils";

const BAR_DELAYS_MS = [-900, -500, -200, -700];
const BAR_DURATIONS_MS = [800, 1000, 700, 900];

// Ojo: dice "transmisiones en vivo", no "estamos en vivo" a propósito — la
// iglesia no transmite todo el tiempo. Si en algún momento se conecta la
// YouTube API para detectar un directo activo, el texto/estado cambia acá
// sin tocar quién lo usa.
// Las barritas tipo ecualizador en vez de un punto parpadeando, al estilo
// de las apps de streaming grandes.
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
