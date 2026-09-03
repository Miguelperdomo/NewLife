import { sundayServices } from "@/data/agenda";
import { getCampusBySlug, getEvents, getFeaturedNews, getMinistryBySlug } from "@/lib/content";
import { formatEventDate } from "@/lib/events";
import type { ChurchEvent, NewsArticle } from "@/lib/types";

/**
 * Capa de agenda: combina los cultos recurrentes (data/agenda.ts) con los
 * eventos y noticias que ya existen (lib/content.ts) en una sola línea de
 * tiempo por día. No introduce almacenamiento propio — solo lee y agrupa lo
 * que ya existe, para que el día que haya backend/MySQL baste con cambiar
 * lib/content.ts; esta capa y los componentes que la consumen no cambiarían.
 */
export type AgendaItemType = "culto" | "evento" | "ministerio" | "noticia";

export interface AgendaItem {
  id: string;
  type: AgendaItemType;
  title: string;
  subtitle?: string;
  time?: string;
  /** Minutos desde medianoche, solo para ordenar los ítems de un mismo día. */
  sortMinutes: number;
  location?: string;
  ministryLabel?: string;
  href?: string;
  imageSrc?: string;
  imageLabel?: string;
  isMultiDay?: boolean;
  dateRangeLabel?: string;
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayISO(): string {
  return toISODate(new Date());
}

export function formatAgendaDayLabel(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  const formatted = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(parsed);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatAgendaMonthLabel(year: number, monthIndex: number): string {
  const monthName = new Intl.DateTimeFormat("es-CO", { month: "long" }).format(
    new Date(year, monthIndex, 1)
  );
  return `${monthName.toUpperCase()} ${year}`;
}

function isSunday(date: string): boolean {
  return new Date(`${date}T00:00:00`).getDay() === 0;
}

function hhmmToMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Lectura best-effort de horas en español ("7:00 p. m."); si no calza, va al final del día. */
function spanishTimeToMinutes(time?: string): number {
  if (!time) return 24 * 60;
  const match = time.match(/(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\.?/i);
  if (!match) return 24 * 60;
  const hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);
  const isPM = match[3].toLowerCase() === "p";
  return (isPM ? hours + 12 : hours) * 60 + minutes;
}

function sundayServiceItems(date: string): AgendaItem[] {
  if (!isSunday(date)) return [];
  return sundayServices.map((service) => {
    const campus = getCampusBySlug(service.campusSlug);
    return {
      id: `culto-${date}-${service.slug}`,
      type: "culto",
      title: service.title,
      subtitle: service.description,
      time: service.time,
      sortMinutes: hhmmToMinutes(service.sortTime),
      location: campus?.name,
    };
  });
}

/** Eventos vigentes en `date`, incluyendo los de varios días (date..endDate). */
function getEventsForDate(date: string): ChurchEvent[] {
  return getEvents().filter((event) => {
    const end = event.endDate ?? event.date;
    return date >= event.date && date <= end;
  });
}

function eventToAgendaItem(event: ChurchEvent): AgendaItem {
  const campus = event.campus ? getCampusBySlug(event.campus) : undefined;
  const ministry = event.ministry ? getMinistryBySlug(event.ministry) : undefined;
  const isMultiDay = Boolean(event.endDate && event.endDate !== event.date);
  return {
    id: `evento-${event.slug}`,
    type: ministry ? "ministerio" : "evento",
    title: event.name,
    subtitle: event.category,
    time: event.time,
    sortMinutes: spanishTimeToMinutes(event.time),
    location: campus?.name ?? event.location,
    ministryLabel: ministry?.name,
    href: `/eventos/${event.slug}`,
    imageSrc: event.imageSrc,
    imageLabel: event.imageLabel,
    isMultiDay,
    dateRangeLabel: isMultiDay ? formatEventDate(event.date, event.endDate) : undefined,
  };
}

/** Solo noticias destacadas, para no saturar la agenda con todo el listado. */
function getFeaturedNewsForDate(date: string): NewsArticle[] {
  return getFeaturedNews().filter((article) => article.publishedAt === date);
}

function newsToAgendaItem(article: NewsArticle): AgendaItem {
  return {
    id: `noticia-${article.slug}`,
    type: "noticia",
    title: article.title,
    subtitle: article.summary,
    sortMinutes: 24 * 60 + 1,
    href: `/noticias/${article.slug}`,
    imageSrc: article.imageSrc,
    imageLabel: article.imageLabel,
  };
}

/** Todo el contenido de una fecha (cultos + eventos + noticias destacadas), ordenado por hora. */
export function getAgendaItemsForDate(date: string): AgendaItem[] {
  const items = [
    ...sundayServiceItems(date),
    ...getEventsForDate(date).map(eventToAgendaItem),
    ...getFeaturedNewsForDate(date).map(newsToAgendaItem),
  ];
  return items.sort((a, b) => a.sortMinutes - b.sortMinutes);
}

/** Qué tipos de contenido tiene cada día de un mes — para pintar los indicadores del calendario. */
export function getAgendaTypesForMonth(
  year: number,
  monthIndex: number
): Record<string, AgendaItemType[]> {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const result: Record<string, AgendaItemType[]> = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const date = toISODate(new Date(year, monthIndex, day));
    const types = new Set<AgendaItemType>();
    if (isSunday(date)) types.add("culto");
    getEventsForDate(date).forEach((event) => types.add(event.ministry ? "ministerio" : "evento"));
    if (getFeaturedNewsForDate(date).length > 0) types.add("noticia");
    if (types.size > 0) result[date] = Array.from(types);
  }

  return result;
}
