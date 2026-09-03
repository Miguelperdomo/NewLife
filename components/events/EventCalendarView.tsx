"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import { formatAgendaDayLabel, toISODate } from "@/lib/agenda";
import { getCampusBySlug, getMinistryBySlug } from "@/lib/content";
import { formatEventDate } from "@/lib/events";
import type { AgendaItemType } from "@/lib/agenda";
import type { ChurchEvent } from "@/lib/types";

const EVENT_LEGEND_TYPES: AgendaItemType[] = ["evento", "ministerio"];

function parseISODate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month: month - 1, day };
}

/** ¿El evento está vigente en `date`? (incluye eventos de varios días). */
function coversDate(event: ChurchEvent, date: string) {
  const end = event.endDate ?? event.date;
  return date >= event.date && date <= end;
}

/**
 * Vista de calendario del listado de eventos — reutiliza el mismo Calendar
 * de la Agenda del Home, pero solo con indicadores de evento/ministerio (sin
 * cultos ni noticias, que no aplican aquí).
 */
export function EventCalendarView({ events }: { events: ChurchEvent[] }) {
  const todayISO = useMemo(() => toISODate(new Date()), []);
  const todayParts = useMemo(() => parseISODate(todayISO), [todayISO]);

  const [viewYear, setViewYear] = useState(todayParts.year);
  const [viewMonth, setViewMonth] = useState(todayParts.month);
  const [selectedDate, setSelectedDate] = useState(todayISO);

  const indicators = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const result: Record<string, AgendaItemType[]> = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const date = toISODate(new Date(viewYear, viewMonth, day));
      const types = new Set<AgendaItemType>();
      events.forEach((event) => {
        if (coversDate(event, date)) types.add(event.ministry ? "ministerio" : "evento");
      });
      if (types.size > 0) result[date] = Array.from(types);
    }
    return result;
  }, [events, viewYear, viewMonth]);

  const dayEvents = useMemo(
    () => events.filter((event) => coversDate(event, selectedDate)),
    [events, selectedDate]
  );

  function changeMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function handleToday() {
    setViewYear(todayParts.year);
    setViewMonth(todayParts.month);
    setSelectedDate(todayISO);
  }

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    const parts = parseISODate(date);
    if (parts.year !== viewYear || parts.month !== viewMonth) {
      setViewYear(parts.year);
      setViewMonth(parts.month);
    }
  }

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100 sm:p-6">
        <Calendar
          year={viewYear}
          month={viewMonth}
          selectedDate={selectedDate}
          todayDate={todayISO}
          indicators={indicators}
          legendTypes={EVENT_LEGEND_TYPES}
          onSelectDate={handleSelectDate}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
          onToday={handleToday}
        />
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100 sm:p-6">
        <p className="font-heading text-base font-bold text-slate-900">{formatAgendaDayLabel(selectedDate)}</p>

        {dayEvents.length > 0 ? (
          <div className="mt-4 space-y-2.5">
            {dayEvents.map((event) => {
              const campus = event.campus ? getCampusBySlug(event.campus) : undefined;
              const ministry = event.ministry ? getMinistryBySlug(event.ministry) : undefined;
              return (
                <Link
                  key={event.slug}
                  href={`/eventos/${event.slug}`}
                  className="block rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-brand-200 hover:bg-white"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {formatEventDate(event.date, event.endDate)}
                    {event.time ? ` · ${event.time}` : ""}
                  </span>
                  <p className="mt-1 font-heading text-sm font-semibold text-slate-900">{event.name}</p>
                  {(campus || ministry) && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      {campus && (
                        <>
                          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          {campus.name}
                        </>
                      )}
                      {campus && ministry && <span aria-hidden="true">·</span>}
                      {ministry?.name}
                    </p>
                  )}
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                    Ver evento
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No hay eventos programados para este día.
          </p>
        )}
      </div>
    </div>
  );
}
