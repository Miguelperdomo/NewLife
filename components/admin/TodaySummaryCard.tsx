"use client";

import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { loadBaptismRequests } from "@/lib/admin/baptismRequests";
import { loadPrayerRequests } from "@/lib/admin/prayerRequests";
import { loadVisitCheckins } from "@/lib/admin/visitCheckins";
import type { AdminSection } from "@/lib/admin/types";

const dayFormatter = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" });

function hasAccess(sections: AdminSection[], section: AdminSection): boolean {
  return sections.includes("full") || sections.includes(section);
}

/**
 * Junta en una sola mirada lo que hoy está repartido en 3 pestañas distintas
 * (Oración/Bautismo/Primera visita) — para que el equipo sepa qué hacer
 * apenas entra al panel, sin tener que revisar pestaña por pestaña. Cada
 * línea solo se muestra si la cuenta tiene ese permiso — si no, ni se pide
 * el dato (RLS lo bloquearía igual, pero así no hay parpadeo de "cargando"
 * para algo a lo que de todos modos no tiene acceso).
 */
export function TodaySummaryCard({ sections }: { sections: AdminSection[] }) {
  const showVisits = hasAccess(sections, "visits");
  const showPrayer = hasAccess(sections, "prayer");
  const showBaptism = hasAccess(sections, "baptism");

  const [loading, setLoading] = useState(true);
  const [visitsToday, setVisitsToday] = useState(0);
  const [pendingPrayers, setPendingPrayers] = useState(0);
  const [pendingBaptisms, setPendingBaptisms] = useState(0);

  useEffect(() => {
    // Si no tiene ninguno de los 3 permisos, el componente ni siquiera se
    // renderiza (ver el `return null` más abajo) — no hay nada que cargar.
    if (!showVisits && !showPrayer && !showBaptism) return;

    let cancelled = false;
    const today = new Date().toISOString().slice(0, 10);

    Promise.all([
      showVisits ? loadVisitCheckins() : Promise.resolve([]),
      showPrayer ? loadPrayerRequests() : Promise.resolve([]),
      showBaptism ? loadBaptismRequests() : Promise.resolve([]),
    ]).then(([visits, prayers, baptisms]) => {
      if (cancelled) return;
      setVisitsToday(visits.filter((visit) => visit.visitDate === today).length);
      setPendingPrayers(prayers.filter((entry) => entry.status === "nueva").length);
      setPendingBaptisms(baptisms.filter((entry) => entry.status === "nueva").length);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [showVisits, showPrayer, showBaptism]);

  if (!showVisits && !showPrayer && !showBaptism) return null;

  const todayLabel = dayFormatter.format(new Date());
  const capitalizedToday = todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1);

  const lines: string[] = [];
  if (showVisits) {
    lines.push(
      visitsToday > 0
        ? `${visitsToday} persona${visitsToday === 1 ? "" : "s"} avisaron que vienen hoy`
        : "Nadie ha avisado que viene hoy"
    );
  }
  if (showPrayer) {
    lines.push(
      pendingPrayers > 0
        ? `${pendingPrayers} pedido${pendingPrayers === 1 ? "" : "s"} de oración sin atender`
        : "No hay pedidos de oración pendientes"
    );
  }
  if (showBaptism) {
    lines.push(
      pendingBaptisms > 0
        ? `${pendingBaptisms} solicitud${pendingBaptisms === 1 ? "" : "es"} de bautismo pendiente${pendingBaptisms === 1 ? "" : "s"}`
        : "No hay solicitudes de bautismo pendientes"
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <CalendarCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
        {capitalizedToday}
      </div>
      {loading ? (
        <p className="mt-2 text-sm text-slate-400">Cargando…</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {lines.map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
