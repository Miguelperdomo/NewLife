import { EventCard } from "@/components/events/EventCard";
import { NewsCard } from "@/components/news/NewsCard";
import type { AdminEvent, AdminNews } from "@/lib/admin/types";
import type { ChurchEvent, NewsArticle } from "@/lib/types";

function toPreviewEvent(event: AdminEvent): ChurchEvent {
  const ministry = event.audience.mode === "specific" ? event.audience.ministrySlugs[0] : undefined;

  return {
    slug: event.slug || "vista-previa",
    name: event.title || "Sin título",
    shortDescription: event.description.slice(0, 140),
    description: event.description,
    imageLabel: event.title || "Evento",
    imageSrc: event.imageSrc,
    date: event.startDate || new Date().toISOString().slice(0, 10),
    endDate: event.endDate,
    time: event.startTime,
    campus: event.campus,
    location: event.location,
    ministry,
  };
}

function toPreviewNews(article: AdminNews): NewsArticle {
  return {
    slug: article.slug || "vista-previa",
    title: article.title || "Sin título",
    summary: article.summary || article.content.slice(0, 140),
    content: article.content,
    imageLabel: article.title || "Noticia",
    imageSrc: article.imageSrc,
    publishedAt: article.publishedAt || new Date().toISOString().slice(0, 10),
    author: article.author,
    category: article.category,
    featured: article.featured,
  };
}

type PreviewItem = { type: "event"; data: AdminEvent } | { type: "news"; data: AdminNews };

/**
 * Renderiza literalmente EventCard/NewsCard (los mismos componentes del
 * sitio público) con los datos del borrador, para que la vista previa sea
 * exacta por construcción en vez de una aproximación aparte.
 */
export function ContentPreview({ item }: { item: PreviewItem }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Así se vería aproximadamente en el sitio público — esta es la misma tarjeta que usan{" "}
        {item.type === "event" ? "/eventos" : "/noticias"}.
      </p>
      <div className="pointer-events-none mx-auto max-w-sm">
        {item.type === "event" ? (
          <EventCard event={toPreviewEvent(item.data)} />
        ) : (
          <NewsCard article={toPreviewNews(item.data)} />
        )}
      </div>
    </div>
  );
}
