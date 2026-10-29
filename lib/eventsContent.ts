import { createPublicClient } from "@/lib/supabase/publicClient";
import { formatEventTime, getEventStatus } from "@/lib/events";
import type { ChurchEvent } from "@/lib/types";

// Tabla `events`, mismo cliente sin cookies que lib/content.ts. Separado de
// ahí porque lib/agenda.ts (componentes "use client") necesita importar esto
// sin arrastrar nada de servidor. RLS ya filtra lo publicado, no hace falta repetirlo acá.
interface EventRow {
  slug: string;
  title: string;
  short_description: string;
  description: string;
  category: string | null;
  image_url: string | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  applies_to_all_ministries: boolean;
  featured: boolean | null;
  highlight_home: boolean | null;
  registration_url: string | null;
  whatsapp_number: string | null;
  created_at: string;
  campus: { slug: string } | null;
  event_ministries: { ministry: { slug: string } | null }[];
}

const EVENT_COLUMNS =
  "slug, title, short_description, description, category, image_url, start_date, end_date, start_time, end_time, location, applies_to_all_ministries, featured, highlight_home, registration_url, whatsapp_number, created_at, campus:campuses(slug), event_ministries(ministry:ministries(slug))";

function rowToEvent(row: EventRow): ChurchEvent {
  const ministrySlugs = (row.event_ministries ?? [])
    .map((item) => item.ministry?.slug)
    .filter((slug): slug is string => Boolean(slug));

  // El público no distingue "aplica a todos" de "sin ministerio". Si hay
  // varios ministerios asociados, mostramos solo el primero (el admin
  // guarda la lista completa, la vista pública simplifica).
  const ministry = row.applies_to_all_ministries ? undefined : ministrySlugs[0];

  return {
    slug: row.slug,
    name: row.title,
    shortDescription: row.short_description,
    description: row.description,
    imageLabel: row.title,
    imageSrc: row.image_url ?? undefined,
    date: row.start_date,
    endDate: row.end_date ?? undefined,
    time: formatEventTime(row.start_time ?? undefined, row.end_time ?? undefined),
    category: row.category ?? undefined,
    ministry,
    campus: row.campus?.slug,
    location: row.location ?? undefined,
    featured: row.featured ?? false,
    highlightHome: row.highlight_home ?? false,
    registrationUrl: row.registration_url ?? undefined,
    whatsappNumber: row.whatsapp_number ?? undefined,
    createdAt: row.created_at,
  };
}

const statusOrder = { hoy: 0, proximo: 1, finalizado: 2 } as const;

/** hoy primero, luego próximos, al final los finalizados */
export async function getEvents(): Promise<ChurchEvent[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .order("start_date", { ascending: true });

  if (error || !data) return [];
  const events = (data as unknown as EventRow[]).map(rowToEvent);

  return events.sort((a, b) => {
    const statusA = getEventStatus(a.date, a.endDate);
    const statusB = getEventStatus(b.date, b.endDate);
    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }
    return statusA === "finalizado" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
  });
}

export async function getEventBySlug(slug: string): Promise<ChurchEvent | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("events").select(EVENT_COLUMNS).eq("slug", slug).maybeSingle();
  if (error || !data) return undefined;
  return rowToEvent(data as unknown as EventRow);
}

export async function getUpcomingEvents(limit?: number): Promise<ChurchEvent[]> {
  const events = await getEvents();
  const upcoming = events.filter((event) => getEventStatus(event.date, event.endDate) !== "finalizado");
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export async function getUpcomingEventsByMinistry(ministrySlug: string, limit?: number): Promise<ChurchEvent[]> {
  const upcoming = await getUpcomingEvents();
  const filtered = upcoming.filter((event) => event.ministry === ministrySlug);
  return limit ? filtered.slice(0, limit) : filtered;
}

/** Eventos próximos de una sede en particular. */
export async function getUpcomingEventsByCampus(campusSlug: string, limit?: number): Promise<ChurchEvent[]> {
  const upcoming = await getUpcomingEvents();
  const filtered = upcoming.filter((event) => event.campus === campusSlug);
  return limit ? filtered.slice(0, limit) : filtered;
}

/** Prioriza el mismo ministerio, completa con próximos si hace falta (igual que getRelatedNews). */
export async function getRelatedEvents(event: ChurchEvent, limit = 3): Promise<ChurchEvent[]> {
  const events = await getEvents();
  const rest = events.filter((candidate) => candidate.slug !== event.slug);
  const sameMinistry = event.ministry ? rest.filter((candidate) => candidate.ministry === event.ministry) : [];
  const others = rest.filter((candidate) => !sameMinistry.includes(candidate));
  return [...sameMinistry, ...others].slice(0, limit);
}
