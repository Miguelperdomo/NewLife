import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { describeAudience } from "@/lib/admin/audience";
import type { AdminEvent } from "@/lib/admin/types";
import { formatEventDate } from "@/lib/events";
import type { Ministry } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

export function UpcomingEvents({ events, ministries }: { events: AdminEvent[]; ministries: Ministry[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-slate-900">Próximos eventos</h2>
        <Link
          href="/admin/contenido?type=event"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Ver todos los eventos
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {events.length > 0 ? (
        <ul className="mt-4 divide-y divide-slate-100">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/admin/contenido/${event.id}/editar?type=event`}
                className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{event.title}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {formatEventDate(event.startDate, event.endDate)}
                    {event.startTime ? ` · ${event.startTime}` : ""}
                    {" · "}
                    {describeAudience(event.audience, ministries)}
                  </p>
                </div>
                <StatusBadge status={event.status} className="shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">No hay próximos eventos.</p>
      )}
    </div>
  );
}
