"use client";

import { useEffect, useMemo, useState } from "react";
import { toContentRows } from "@/lib/admin/contentRows";
import { useAdminContent } from "@/lib/admin/useAdminContent";
import { useAdminMinistries } from "@/lib/admin/useAdminMinistries";
import { getMinistries } from "@/lib/content";
import { getEventStatus } from "@/lib/events";
import { DashboardStats } from "./DashboardStats";
import { QuickActions } from "./QuickActions";
import { RecentContent } from "./RecentContent";
import { SystemStatusCard } from "./SystemStatusCard";
import { UpcomingEvents } from "./UpcomingEvents";

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

export function AdminDashboard() {
  const { events, news, isReady } = useAdminContent();
  const { ministries: adminMinistries, isReady: ministriesReady } = useAdminMinistries();
  const ministries = useMemo(() => getMinistries(), []);
  const greeting = useGreeting();

  const totalDrafts =
    events.filter((event) => event.status === "draft").length +
    news.filter((article) => article.status === "draft").length;
  const totalScheduled =
    events.filter((event) => event.status === "scheduled").length +
    news.filter((article) => article.status === "scheduled").length;

  const recentRows = useMemo(
    () =>
      toContentRows(events, news, ministries)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 5),
    [events, news, ministries]
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

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-slate-500">{greeting} 👋</p>
        <h2 className="font-heading text-2xl font-bold text-slate-900">
          Bienvenido al panel administrativo de New Life
        </h2>
      </div>

      <DashboardStats
        totalEvents={events.length}
        totalNews={news.length}
        totalDrafts={totalDrafts}
        totalScheduled={totalScheduled}
        totalMinistries={ministriesReady ? adminMinistries.length : undefined}
      />

      <QuickActions />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentContent rows={recentRows} />
        <UpcomingEvents events={upcomingEvents} ministries={ministries} />
      </div>

      <SystemStatusCard />
    </div>
  );
}
