import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AdminEvent } from "@/lib/admin/types";

const DAY_LABELS = ["D", "L", "M", "X", "J", "V", "S"];

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Mini calendario de los próximos 7 días (hoy incluido) con un punto en los
 * días que tienen algún evento — en vez de solo una lista de texto, para
 * captar de un vistazo qué tan cargada viene la semana.
 */
export function WeekMiniCalendar({ events }: { events: AdminEvent[] }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const iso = toISODate(date);
    const count = events.filter((event) => {
      if (event.status === "archived") return false;
      const end = event.endDate ?? event.startDate;
      return iso >= event.startDate && iso <= end;
    }).length;
    return { iso, date, count };
  });

  return (
    <Link href="/admin/contenido" className="block rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-brand-200">
      <h3 className="font-heading text-sm font-bold text-slate-900">Próximos 7 días</h3>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {days.map(({ iso, date, count }, index) => (
          <div key={iso} className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-slate-400">{DAY_LABELS[date.getDay()]}</span>
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                index === 0 ? "bg-brand-600 text-white" : count > 0 ? "bg-brand-50 text-brand-700" : "text-slate-400"
              )}
            >
              {date.getDate()}
            </span>
            <span
              className={cn("h-1.5 w-1.5 rounded-full", count > 0 ? "bg-accent-500" : "bg-transparent")}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </Link>
  );
}
