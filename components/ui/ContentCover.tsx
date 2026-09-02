import { CalendarDays, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

const kindConfig = {
  event: { label: "Evento", Icon: CalendarDays },
  news: { label: "Noticia", Icon: Newspaper },
} as const;

/**
 * Portada de marca para cuando un Evento o Noticia no tiene imagen. Pensada
 * para reutilizarse donde haga falta (hoy: panel admin), no solo aquí.
 */
export function ContentCover({
  kind,
  className,
}: {
  kind: keyof typeof kindConfig;
  className?: string;
}) {
  const { label, Icon } = kindConfig[kind];

  return (
    <div
      role="img"
      aria-label={`Portada de ${label.toLowerCase()} sin imagen`}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-slate-950 text-white",
        className
      )}
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(245,158,11,0.25),_transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,_rgba(139,92,246,0.3),_transparent_55%)]"
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center gap-2">
        <Icon className="h-6 w-6 text-accent-400" aria-hidden="true" />
        <span className="font-heading text-sm font-bold uppercase tracking-[0.2em]">New Life</span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-400">
          {label}
        </span>
      </div>
    </div>
  );
}
