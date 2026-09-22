import { describeAudience } from "@/lib/admin/audience";
import type { AdminEvent, AdminNews, ContentRow } from "@/lib/admin/types";

type MinistryLike = { slug: string; name: string };

/**
 * Aplana un AdminEvent/AdminNews a la forma común que consumen ContentTable,
 * RecentContent, etc. Un solo lugar para este mapeo — no duplicarlo.
 */
export function eventToRow(event: AdminEvent, ministries: MinistryLike[]): ContentRow {
  return {
    id: event.id,
    type: "event",
    title: event.title,
    imageSrc: event.imageSrc,
    status: event.status,
    date: event.startDate,
    updatedAt: event.updatedAt,
    ministryLabel: describeAudience(event.audience, ministries),
    featured: event.featured,
  };
}

export function newsToRow(article: AdminNews): ContentRow {
  return {
    id: article.id,
    type: "news",
    title: article.title,
    imageSrc: article.imageSrc,
    status: article.status,
    date: article.publishedAt,
    updatedAt: article.updatedAt,
    ministryLabel: article.category,
    featured: article.featured,
  };
}

export function toContentRows(
  events: AdminEvent[],
  news: AdminNews[],
  ministries: MinistryLike[]
): ContentRow[] {
  return [...events.map((event) => eventToRow(event, ministries)), ...news.map(newsToRow)];
}
