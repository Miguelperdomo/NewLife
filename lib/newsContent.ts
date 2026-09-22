import { createPublicClient } from "@/lib/supabase/publicClient";
import type { NewsArticle } from "@/lib/types";

/**
 * Acceso a Noticias — Supabase (tabla `news`), mismo cliente sin cookies que
 * Eventos/Ministerios/Sedes (createPublicClient). Aparte de lib/content.ts
 * por la misma razón que lib/eventsContent.ts: lib/agenda.ts lo usan
 * componentes "use client". RLS ya filtra a solo publicadas (o programadas
 * ya vencidas) — no hace falta repetir ese filtro acá.
 */
interface NewsRow {
  slug: string;
  title: string;
  summary: string;
  content: string;
  image_url: string | null;
  published_at: string;
  author: string | null;
  featured: boolean;
  category: { name: string } | null;
}

const NEWS_COLUMNS =
  "slug, title, summary, content, image_url, published_at, author, featured, category:news_categories(name)";

function rowToNews(row: NewsRow): NewsArticle {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    imageLabel: row.title,
    imageSrc: row.image_url ?? undefined,
    publishedAt: row.published_at,
    author: row.author ?? undefined,
    category: row.category?.name,
    featured: row.featured,
  };
}

/** Más recientes primero. */
export async function getNews(limit?: number): Promise<NewsArticle[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_COLUMNS)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  const news = (data as unknown as NewsRow[]).map(rowToNews);
  return limit ? news.slice(0, limit) : news;
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("news").select(NEWS_COLUMNS).eq("slug", slug).maybeSingle();
  if (error || !data) return undefined;
  return rowToNews(data as unknown as NewsRow);
}

export async function getFeaturedNews(limit?: number): Promise<NewsArticle[]> {
  const news = await getNews();
  const featured = news.filter((article) => article.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/** Prioriza noticias de la misma categoría; completa con las más recientes si hacen falta. */
export async function getRelatedNews(article: NewsArticle, limit = 3): Promise<NewsArticle[]> {
  const news = await getNews();
  const rest = news.filter((candidate) => candidate.slug !== article.slug);
  const sameCategory = article.category ? rest.filter((candidate) => candidate.category === article.category) : [];
  const others = rest.filter((candidate) => !sameCategory.includes(candidate));
  return [...sameCategory, ...others].slice(0, limit);
}
