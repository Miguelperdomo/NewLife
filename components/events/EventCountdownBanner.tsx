import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDaysUntil, getEventStatus } from "@/lib/events";
import type { ChurchEvent } from "@/lib/types";

function CountdownRow({ event }: { event: ChurchEvent }) {
  const daysUntil = getDaysUntil(event.date);

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl px-6 py-6 text-center text-white transition-colors sm:flex-row sm:justify-between sm:text-left",
        event.featured
          ? "bg-gradient-to-r from-accent-500 via-brand-600 to-brand-700 shadow-lg shadow-brand-900/30 hover:from-accent-400 hover:to-brand-600"
          : "bg-brand-600 hover:bg-brand-700"
      )}
    >
      <div>
        <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/70 sm:justify-start">
          {event.featured && <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
          {event.featured ? "Evento destacado" : "Próximo evento"}
        </p>
        <p className={cn("font-heading font-bold", event.featured ? "text-xl" : "text-lg")}>{event.name}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <span
          key={daysUntil}
          className={cn("animate-flip-in font-heading font-bold leading-none", event.featured ? "text-5xl" : "text-4xl")}
        >
          {daysUntil}
        </span>
        <span className="text-sm text-white/80">día{daysUntil === 1 ? "" : "s"}</span>
      </div>
    </Link>
  );
}

/**
 * Cuenta regresiva de eventos. Si hay un evento marcado "Destacado", se
 * muestra con estilo llamativo (degradado + estrella) Y, debajo, el próximo
 * evento que sigue (sin marcar) con el estilo sencillo de siempre — así se
 * ve la diferencia entre los dos, sin que el no-destacado desaparezca. Si
 * nadie marcó ninguno como destacado, se muestra solo uno: el más próximo,
 * con el estilo sencillo (igual que antes). Nunca cuenta un evento que ya es
 * "hoy" (un contador de días no tiene sentido para algo que está pasando
 * ahora). Se usa tanto en el Home (UpcomingEventsSection) como en /eventos.
 */
export function EventCountdownBanner({ events, className = "" }: { events: ChurchEvent[]; className?: string }) {
  const upcomingNotToday = events
    .filter((event) => getEventStatus(event.date, event.endDate) === "proximo")
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcomingNotToday.length === 0) return null;

  const featured = upcomingNotToday.find((event) => event.featured);
  const next = upcomingNotToday.find((event) => event.slug !== featured?.slug);
  const rows = featured ? [featured, next].filter((event): event is ChurchEvent => Boolean(event)) : [upcomingNotToday[0]];

  return (
    <div className={cn("space-y-3", className)}>
      {rows.map((event) => (
        <CountdownRow key={event.slug} event={event} />
      ))}
    </div>
  );
}
