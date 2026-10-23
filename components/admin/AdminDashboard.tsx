"use client";

import { useEffect, useMemo, useState } from "react";
import { toContentRows } from "@/lib/admin/contentRows";
import { useAdminCampuses } from "@/lib/admin/useAdminCampuses";
import { useAdminContent } from "@/lib/admin/useAdminContent";
import { useAdminMinistries } from "@/lib/admin/useAdminMinistries";
import { getEventStatus } from "@/lib/events";
import type { AdminSection } from "@/lib/admin/types";
import { DashboardSearch } from "./DashboardSearch";
import { DashboardStats } from "./DashboardStats";
import { ImpactChart } from "./ImpactChart";
import { PageViewsCard } from "./PageViewsCard";
import { QuickActions } from "./QuickActions";
import { RecentContent } from "./RecentContent";
import { RemindersCard } from "./RemindersCard";
import { TodaySummaryCard } from "./TodaySummaryCard";
import { UpcomingEvents } from "./UpcomingEvents";
import { WeekMiniCalendar } from "./WeekMiniCalendar";

const fullDateFormatter = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" });

function useGreeting() {
  const [greeting, setGreeting] = useState("Hola");

  useEffect(() => {
    const hour = new Date().getHours();
    // Excepción deliberada, igual que en useAdminContent: la hora real solo
    // existe en el cliente, así que se fija después del montaje para no
    // romper la hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches");
  }, []);

  return greeting;
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

export function AdminDashboard({ sections, name }: { sections: AdminSection[]; name: string }) {
  const { events, news, isReady } = useAdminContent();
  const { ministries: adminMinistries, isReady: ministriesReady } = useAdminMinistries();
  const { campuses, isReady: campusesReady } = useAdminCampuses();
  const greeting = useGreeting();
  const todayLabel = fullDateFormatter.format(new Date());
  const capitalizedToday = todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1);
  // Una cuenta con un único permiso puntual (ej. solo "Oración") no tiene
  // nada que hacer con estadísticas generales de todo el sitio — ve un
  // Dashboard reducido a lo suyo en vez del panel completo.
  const isFocusedRole = !sections.includes("full") && sections.length === 1;

  const totalDrafts =
    events.filter((event) => event.status === "draft").length +
    news.filter((article) => article.status === "draft").length;
  const totalScheduled =
    events.filter((event) => event.status === "scheduled").length +
    news.filter((article) => article.status === "scheduled").length;

  const recentRows = useMemo(
    () =>
      toContentRows(events, news, adminMinistries)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 5),
    [events, news, adminMinistries]
  );

  const upcomingEvents = useMemo(
    () =>
      events
        .filter(
          (event) =>
            event.status !== "archived" && getEventStatus(event.startDate, event.endDate) !== "finalizado"
        )
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .slice(0, 4),
    [events]
  );

  if (!isReady) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Cargando panel…
      </p>
    );
  }

  // Cuenta con un solo permiso puntual (ej. un voluntario que solo ve
  // Oración) — nada de estadísticas generales que no le sirven ni puede
  // usar, directo a lo suyo.
  if (isFocusedRole) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">
            {greeting}, {firstName(name)} 👋
          </p>
          <h2 className="font-heading text-2xl font-bold text-slate-900">{capitalizedToday}</h2>
        </div>
        <TodaySummaryCard sections={sections} />
        <QuickActions sections={sections} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 p-6 text-white shadow-lg shadow-brand-900/20 sm:p-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative">
          <p className="text-sm text-white/70">
            {greeting}, {firstName(name)} 👋 · {capitalizedToday}
          </p>
          <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">Panel administrativo de New Life</h2>
          <div className="mt-5 max-w-xl">
            <DashboardSearch />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TodaySummaryCard sections={sections} />
        <WeekMiniCalendar events={events} />
        <RemindersCard events={events} news={news} />
      </div>

      <DashboardStats
        totalEvents={events.length}
        totalNews={news.length}
        totalDrafts={totalDrafts}
        totalScheduled={totalScheduled}
        totalMinistries={ministriesReady ? adminMinistries.length : undefined}
        totalCampuses={campusesReady ? campuses.length : undefined}
      />

      <QuickActions sections={sections} />

      <ImpactChart sections={sections} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentContent rows={recentRows} />
        <UpcomingEvents events={upcomingEvents} ministries={adminMinistries} />
      </div>

      <PageViewsCard />
    </div>
  );
}
