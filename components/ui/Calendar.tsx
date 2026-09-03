"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAgendaMonthLabel, toISODate } from "@/lib/agenda";
import type { AgendaItemType } from "@/lib/agenda";

/** Un único mapa de color/etiqueta por tipo, reutilizado por el calendario,
 * su leyenda y AgendaEventItem — una sola fuente de verdad visual. */
export const agendaTypeMeta: Record<AgendaItemType, { label: string; dotClass: string }> = {
  culto: { label: "Cultos", dotClass: "bg-brand-600" },
  evento: { label: "Eventos", dotClass: "bg-blue-500" },
  ministerio: { label: "Ministerios", dotClass: "bg-emerald-500" },
  noticia: { label: "Noticias", dotClass: "bg-accent-500" },
};

const weekdayLabels = [
  { short: "L", full: "Lunes" },
  { short: "M", full: "Martes" },
  { short: "M", full: "Miércoles" },
  { short: "J", full: "Jueves" },
  { short: "V", full: "Viernes" },
  { short: "S", full: "Sábado" },
  { short: "D", full: "Domingo" },
];

interface CalendarProps {
  year: number;
  /** 0-11 */
  month: number;
  selectedDate: string;
  todayDate: string;
  indicators: Record<string, AgendaItemType[]>;
  /** Qué tipos mostrar en la leyenda — por defecto los 4, para no cambiar la Agenda del Home. */
  legendTypes?: AgendaItemType[];
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const allAgendaTypes = Object.keys(agendaTypeMeta) as AgendaItemType[];

export function Calendar({
  year,
  month,
  selectedDate,
  todayDate,
  indicators,
  legendTypes = allAgendaTypes,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarProps) {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
  const totalCells = Math.ceil((leadingBlanks + daysInMonth) / 7) * 7;
  const monthLabel = formatAgendaMonthLabel(year, month);

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-heading text-base font-bold tracking-wide text-slate-900 sm:text-lg">
          {monthLabel}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Mes anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onToday}
            aria-label="Ir al mes actual"
            className="rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600 transition-colors hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Mes siguiente"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-y-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
        {weekdayLabels.map((weekday, index) => (
          <span key={`${weekday.short}-${index}`}>
            <span aria-hidden="true">{weekday.short}</span>
            <span className="sr-only">{weekday.full}</span>
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: totalCells }, (_, index) => {
          const day = index - leadingBlanks + 1;
          if (day < 1 || day > daysInMonth) {
            return <div key={`blank-${index}`} aria-hidden="true" />;
          }

          const date = toISODate(new Date(year, month, day));
          const isToday = date === todayDate;
          const isSelected = date === selectedDate;
          const types = indicators[date] ?? [];

          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelectDate(date)}
              aria-label={`${day} de ${monthLabel.toLowerCase()}${isToday ? ", hoy" : ""}${isSelected ? ", seleccionado" : ""}`}
              aria-pressed={isSelected}
              className={cn(
                "relative flex h-11 flex-col items-center justify-center gap-1 rounded-xl text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
                isToday && "bg-brand-600 text-white hover:bg-brand-700",
                !isToday && isSelected && "bg-brand-100 text-brand-700 ring-2 ring-inset ring-brand-600",
                !isToday && !isSelected && "text-slate-700 hover:bg-slate-100"
              )}
            >
              {day}
              <span className="flex h-1.5 items-center gap-0.5">
                {types.slice(0, 4).map((type) => (
                  <span
                    key={type}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      isToday ? "bg-white" : agendaTypeMeta[type].dotClass
                    )}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        {legendTypes.map((type) => (
          <span key={type} className="inline-flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", agendaTypeMeta[type].dotClass)} aria-hidden="true" />
            {agendaTypeMeta[type].label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-600 ring-2 ring-brand-200" aria-hidden="true" />
          Hoy
        </span>
      </div>
    </div>
  );
}
