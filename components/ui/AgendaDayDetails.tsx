import { CalendarDays, Church, Newspaper } from "lucide-react";
import { AgendaEventItem } from "@/components/ui/AgendaEventItem";
import { Button } from "@/components/ui/Button";
import { formatAgendaDayLabel } from "@/lib/agenda";
import type { AgendaItem } from "@/lib/agenda";

function AgendaGroup({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof Church;
  items: AgendaItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {title}
      </h4>
      <div className="mt-3 space-y-2.5">
        {items.map((item) => (
          <AgendaEventItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function AgendaDayDetails({ date, items }: { date: string; items: AgendaItem[] }) {
  const dayNumber = Number(date.slice(-2));
  const cultos = items.filter((item) => item.type === "culto");
  const eventos = items.filter((item) => item.type === "evento" || item.type === "ministerio");
  const noticias = items.filter((item) => item.type === "noticia");

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="font-heading text-3xl font-bold text-slate-900">{dayNumber}</span>
        <span className="text-sm font-medium text-slate-500">{formatAgendaDayLabel(date)}</span>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
          <p className="font-heading text-sm font-semibold text-slate-700">
            Hoy no tenemos actividades programadas.
          </p>
          <p className="mt-1 text-sm text-slate-500">Pero siempre hay un lugar para ti en New Life.</p>
          <Button href="/ministerios" variant="ghost" className="mt-4">
            Conoce nuestros ministerios
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <AgendaGroup title="Cultos del día" icon={Church} items={cultos} />
          <AgendaGroup title="Eventos del día" icon={CalendarDays} items={eventos} />
          <AgendaGroup title="Noticias destacadas" icon={Newspaper} items={noticias} />
        </div>
      )}
    </div>
  );
}
