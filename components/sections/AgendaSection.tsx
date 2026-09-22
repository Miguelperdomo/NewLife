"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { AgendaDayDetails } from "@/components/ui/AgendaDayDetails";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAgendaItemsForDate, getAgendaTypesForMonth, getTodayISO } from "@/lib/agenda";
import { formatEventTime } from "@/lib/events";
import type { Campus, ChurchEvent, Ministry, NewsArticle } from "@/lib/types";

function parseISODate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month: month - 1, day };
}

export function AgendaSection({
  ministries,
  campuses,
  events,
  news,
}: {
  ministries: Ministry[];
  campuses: Campus[];
  events: ChurchEvent[];
  news: NewsArticle[];
}) {
  const todayISO = useMemo(() => getTodayISO(), []);
  const todayParts = useMemo(() => parseISODate(todayISO), [todayISO]);

  const [viewYear, setViewYear] = useState(todayParts.year);
  const [viewMonth, setViewMonth] = useState(todayParts.month);
  const [selectedDate, setSelectedDate] = useState(todayISO);

  const indicators = useMemo(
    () => getAgendaTypesForMonth(viewYear, viewMonth, campuses, events, news),
    [viewYear, viewMonth, campuses, events, news]
  );
  const dayItems = useMemo(
    () => getAgendaItemsForDate(selectedDate, ministries, campuses, events, news),
    [selectedDate, ministries, campuses, events, news]
  );
  // Solo los cultos dominicales de todas las sedes, para el panel de abajo
  // ("Todos los domingos") — el resto de horarios (si hay entre semana)
  // igual aparecen en el calendario, solo no se resumen aquí.
  const sundayPills = useMemo(
    () =>
      campuses.flatMap((campus) =>
        (campus.schedules ?? [])
          .filter((schedule) => schedule.dayOfWeek === 0)
          .map((schedule) => ({
            key: `${campus.slug}-${schedule.time}-${schedule.title}`,
            label: formatEventTime(schedule.time) ?? schedule.time,
          }))
      ),
    [campuses]
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
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Agenda New Life"
          title="Mantente al día con todo lo que Dios está haciendo"
          description="Revisa nuestro calendario de cultos, eventos y actividades especiales. Siempre hay algo preparado para ti y tu familia."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100 sm:p-6">
            <Calendar
              year={viewYear}
              month={viewMonth}
              selectedDate={selectedDate}
              todayDate={todayISO}
              indicators={indicators}
              onSelectDate={handleSelectDate}
              onPrevMonth={() => changeMonth(-1)}
              onNextMonth={() => changeMonth(1)}
              onToday={handleToday}
            />

            <Link
              href="/eventos"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              Ver lista completa
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100 sm:p-6">
            <AgendaDayDetails date={selectedDate} items={dayItems} />
          </div>
        </div>

        {sundayPills.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-3xl bg-brand-700 px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-accent-300">
                  <CalendarDays className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-accent-300">
                    Todos los domingos
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-bold sm:text-2xl">
                    Cultos en todos nuestros horarios
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sundayPills.map((pill) => (
                      <span key={pill.key} className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
                        {pill.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button href="/sedes" variant="secondary" size="lg" className="shrink-0">
                Planifica tu visita
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
