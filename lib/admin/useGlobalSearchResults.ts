"use client";

import { useMemo, useState } from "react";
import { Calendar, MapPin, Newspaper, Users } from "lucide-react";
import { useAdminCampuses } from "@/lib/admin/useAdminCampuses";
import { useAdminContent } from "@/lib/admin/useAdminContent";
import { useAdminMinistries } from "@/lib/admin/useAdminMinistries";

export interface GlobalSearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: typeof Users;
}

const MAX_RESULTS = 8;

/**
 * Lógica compartida entre GlobalSearch (el campo chiquito del encabezado) y
 * DashboardSearch (el campo grande de bienvenida del Dashboard) — mismo
 * resultado, dos presentaciones distintas, sin repetir el filtrado dos veces.
 */
export function useGlobalSearchResults() {
  const { ministries } = useAdminMinistries();
  const { campuses } = useAdminCampuses();
  const { events, news } = useAdminContent();
  const [query, setQuery] = useState("");

  const allResults = useMemo<GlobalSearchResult[]>(
    () => [
      ...ministries.map((ministry) => ({
        id: `ministerio-${ministry.id}`,
        title: ministry.name,
        subtitle: "Ministerio",
        href: `/admin/ministerios/${ministry.id}/editar`,
        icon: Users,
      })),
      ...campuses.map((campus) => ({
        id: `sede-${campus.id}`,
        title: campus.name,
        subtitle: "Sede",
        href: `/admin/sedes/${campus.id}/editar`,
        icon: MapPin,
      })),
      ...events.map((event) => ({
        id: `evento-${event.id}`,
        title: event.title,
        subtitle: "Evento",
        href: `/admin/contenido/${event.id}/editar?type=event`,
        icon: Calendar,
      })),
      ...news.map((article) => ({
        id: `noticia-${article.id}`,
        title: article.title,
        subtitle: "Noticia",
        href: `/admin/contenido/${article.id}/editar?type=news`,
        icon: Newspaper,
      })),
    ],
    [ministries, campuses, events, news]
  );

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return allResults.filter((item) => item.title.toLowerCase().includes(trimmed)).slice(0, MAX_RESULTS);
  }, [allResults, query]);

  return { query, setQuery, results };
}
