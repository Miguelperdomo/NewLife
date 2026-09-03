import { CalendarClock, CalendarDays, FileEdit, Newspaper, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: number;
  icon: typeof CalendarDays;
  accent: string;
}

export function DashboardStats({
  totalEvents,
  totalNews,
  totalDrafts,
  totalScheduled,
  totalMinistries,
}: {
  totalEvents: number;
  totalNews: number;
  totalDrafts: number;
  totalScheduled: number;
  /** Opcional: solo se agrega una 5ª tarjeta si se pasa (no cambia el layout de quien no la use). */
  totalMinistries?: number;
}) {
  const stats: StatCard[] = [
    { label: "Eventos", value: totalEvents, icon: CalendarDays, accent: "bg-brand-50 text-brand-600" },
    { label: "Noticias", value: totalNews, icon: Newspaper, accent: "bg-brand-50 text-brand-600" },
    { label: "Borradores", value: totalDrafts, icon: FileEdit, accent: "bg-slate-100 text-slate-500" },
    { label: "Programados", value: totalScheduled, icon: CalendarClock, accent: "bg-accent-50 text-accent-600" },
  ];

  if (typeof totalMinistries === "number") {
    stats.push({ label: "Ministerios", value: totalMinistries, icon: Users, accent: "bg-brand-50 text-brand-600" });
  }

  return (
    <div className={cn("grid grid-cols-2 gap-4", stats.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4")}>
      {stats.map(({ label, value, icon: Icon, accent }) => (
        <div
          key={label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100"
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="mt-4 font-heading text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
