import { campuses } from "@/data/campuses";
import { events } from "@/data/events";
import { ministries } from "@/data/ministries";
import { news } from "@/data/news";
import { pastors } from "@/data/pastors";
import { verses } from "@/data/verses";
import { getEventStatus } from "@/lib/events";
import type { Campus, ChurchEvent, Ministry, NewsArticle, Pastor, Verse } from "@/lib/types";

/**
 * Capa de acceso a contenido. Hoy lee de los archivos en /data; el día que
 * haya un CMS/DB, solo cambia la implementación de estas funciones — las
 * páginas y componentes que las consumen no se modifican.
 */
export function getMinistries(): Ministry[] {
  return ministries;
}

export function getMinistryBySlug(slug: string): Ministry | undefined {
  return ministries.find((ministry) => ministry.slug === slug);
}

export function getCampuses(): Campus[] {
  return campuses;
}

export function getCampusBySlug(slug: string): Campus | undefined {
  return campuses.find((campus) => campus.slug === slug);
}

export function getPastors(): Pastor[] {
  return [...pastors].sort((a, b) => a.tier - b.tier);
}

const statusOrder = { hoy: 0, proximo: 1, finalizado: 2 } as const;

/** Ordenados: hoy primero, luego los próximos (más cercano primero), y al final los ya finalizados (más reciente primero). */
export function getEvents(): ChurchEvent[] {
  return [...events].sort((a, b) => {
    const statusA = getEventStatus(a.date, a.endDate);
    const statusB = getEventStatus(b.date, b.endDate);
    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }
    return statusA === "finalizado" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
  });
}

export function getEventBySlug(slug: string): ChurchEvent | undefined {
  return events.find((event) => event.slug === slug);
}

export function getUpcomingEvents(limit?: number): ChurchEvent[] {
  const upcoming = getEvents().filter(
    (event) => getEventStatus(event.date, event.endDate) !== "finalizado"
  );
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export function getUpcomingEventsByMinistry(ministrySlug: string, limit?: number): ChurchEvent[] {
  const upcoming = getUpcomingEvents().filter((event) => event.ministry === ministrySlug);
  return limit ? upcoming.slice(0, limit) : upcoming;
}

/** Solo publicadas (status !== "draft"), más recientes primero. */
export function getNews(limit?: number): NewsArticle[] {
  const published = [...news]
    .filter((article) => (article.status ?? "published") === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return limit ? published.slice(0, limit) : published;
}

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return news.find((article) => article.slug === slug);
}

export function getFeaturedNews(limit?: number): NewsArticle[] {
  const featured = getNews().filter((article) => article.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/** Prioriza noticias de la misma categoría; completa con las más recientes si hacen falta. */
export function getRelatedNews(article: NewsArticle, limit = 3): NewsArticle[] {
  const rest = getNews().filter((candidate) => candidate.slug !== article.slug);
  const sameCategory = article.category
    ? rest.filter((candidate) => candidate.category === article.category)
    : [];
  const others = rest.filter((candidate) => !sameCategory.includes(candidate));
  return [...sameCategory, ...others].slice(0, limit);
}

/** Elige un versículo distinto cada día del año, de forma estable (mismo resultado todo el día). */
export function getDailyVerse(): Verse {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000);
  return verses[dayOfYear % verses.length];
}
