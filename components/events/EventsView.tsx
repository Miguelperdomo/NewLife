"use client";

import { useState } from "react";
import { CalendarDays, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Campus, ChurchEvent, Ministry } from "@/lib/types";
import { EventCalendarView } from "./EventCalendarView";
import { EventList } from "./EventList";

type ViewMode = "list" | "calendar";

const modes: { mode: ViewMode; label: string; icon: typeof List }[] = [
  { mode: "list", label: "Lista", icon: List },
  { mode: "calendar", label: "Calendario", icon: CalendarDays },
];

/**
 * Envuelve EventList (sin tocarlo) y agrega una vista de calendario
 * alternativa — el toggle decide cuál de las dos se muestra.
 */
export function EventsView({
  events,
  ministries,
  campuses,
}: {
  events: ChurchEvent[];
  ministries: Ministry[];
  campuses: Campus[];
}) {
  const [mode, setMode] = useState<ViewMode>("list");

  return (
    <div>
      <div className="flex justify-end">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
          {modes.map(({ mode: value, label, icon: Icon }) => {
            const isActive = value === mode;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600",
                  isActive ? "bg-brand-600 text-white" : "text-slate-500 hover:text-brand-600"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {mode === "list" ? (
        <div className="mt-6">
          <EventList events={events} ministries={ministries} campuses={campuses} />
        </div>
      ) : (
        <EventCalendarView events={events} ministries={ministries} campuses={campuses} />
      )}
    </div>
  );
}
