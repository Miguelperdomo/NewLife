"use client";

import { useMemo, useState } from "react";
import { EventCard } from "./EventCard";
import { EventFilters, type EventFilterOption } from "./EventFilters";
import type { Campus, ChurchEvent, Ministry } from "@/lib/types";

/**
 * Único componente con estado del módulo de eventos: guarda el filtro activo
 * y renderiza EventFilters (controlado) + la grilla de EventCard. Ministerios
 * y sedes llegan ya resueltos desde el servidor (ver EventsView/EventCard).
 */
export function EventList({
  events,
  ministries,
  campuses,
}: {
  events: ChurchEvent[];
  ministries: Ministry[];
  campuses: Campus[];
}) {
  const [active, setActive] = useState("todos");

  const options: EventFilterOption[] = useMemo(() => {
    return [
      { label: "Todos", value: "todos" },
      ...ministries.map((ministry) => ({ label: ministry.name, value: ministry.slug })),
      { label: "General", value: "general" },
    ];
  }, [ministries]);

  const filtered =
    active === "todos"
      ? events
      : events.filter((event) =>
          active === "general" ? !event.ministry : event.ministry === active
        );

  return (
    <div>
      <EventFilters options={options} active={active} onChange={setActive} />

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event, index) => (
            <EventCard key={event.slug} event={event} ministries={ministries} campuses={campuses} index={index} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
          No hay eventos para este filtro por ahora.
        </p>
      )}
    </div>
  );
}
