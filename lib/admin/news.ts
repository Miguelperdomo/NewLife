import { createClient } from "@/lib/supabase/client";
import { slugify, uniqueSlug } from "@/lib/admin/slug";
import type { AdminNews } from "@/lib/admin/types";

/**
 * Capa de datos de Noticias contra Supabase (tabla `news`). La categoría es
 * texto libre en el formulario (igual que siempre), pero en la base de datos
 * es una relación real con `news_categories` — al guardar, si la categoría
 * escrita no existe todavía, se crea sola (sin que haya que ir a otra
 * pantalla a crearla primero). Mismo patrón de "resolver por nombre/slug"
 * que ya se usa para el pastor responsable de una sede.
 */
interface NewsRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  image_url: string | null;
  status: "draft" | "published" | "scheduled" | "archived";
  publish_at: string | null;
  published_at: string;
  author: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category: { name: string } | null;
}

const SELECT_COLUMNS =
  "id, slug, title, summary, content, image_url, status, publish_at, published_at, author, featured, created_at, updated_at, category:news_categories(name)";

function rowToNews(row: NewsRow): AdminNews {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    imageSrc: row.image_url ?? undefined,
    status: row.status,
    publishAt: row.publish_at ?? undefined,
    publishedAt: row.published_at,
    author: row.author ?? undefined,
    category: row.category?.name,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Busca una categoría por nombre (sin importar mayúsculas); si no existe, la crea. */
async function resolveCategoryId(categoryName?: string): Promise<string | null> {
  const trimmed = categoryName?.trim();
  if (!trimmed) return null;
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("news_categories")
    .select("id")
    .ilike("name", trimmed)
    .maybeSingle();
  if (existing) return (existing as { id: string }).id;

  const { data: created, error } = await supabase
    .from("news_categories")
    .insert({ name: trimmed, slug: slugify(trimmed) })
    .select("id")
    .single();

  if (error || !created) {
    // Posible carrera (otra pestaña creó la misma categoría justo antes) —
    // se reintenta la búsqueda una vez antes de rendirse.
    const { data: retry } = await supabase
      .from("news_categories")
      .select("id")
      .ilike("name", trimmed)
      .maybeSingle();
    return (retry as { id: string } | null)?.id ?? null;
  }

  return (created as { id: string }).id;
}

async function fetchNewsById(id: string): Promise<AdminNews> {
  const supabase = createClient();
  const { data, error } = await supabase.from("news").select(SELECT_COLUMNS).eq("id", id).single();
  if (error || !data) throw new Error(error?.message ?? "No se pudo leer la noticia.");
  return rowToNews(data as unknown as NewsRow);
}

export async function loadNews(): Promise<AdminNews[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("news")
    .select(SELECT_COLUMNS)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as NewsRow[]).map(rowToNews);
}

type NewNewsInput = Omit<AdminNews, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };

export async function createNews(input: NewNewsInput, existingSlugs: string[]): Promise<AdminNews> {
  const supabase = createClient();
  const slug = uniqueSlug(input.slug || slugify(input.title), existingSlugs, "noticia");
  const categoryId = await resolveCategoryId(input.category);

  const { data, error } = await supabase
    .from("news")
    .insert({
      slug,
      title: input.title,
      // La base de datos exige un resumen — si el formulario lo deja vacío
      // (es opcional ahí), se usa el inicio del contenido, igual que ya
      // hacía la vista previa (ver components/admin/ContentPreview.tsx).
      summary: input.summary?.trim() || input.content.slice(0, 140),
      content: input.content,
      image_url: input.imageSrc || null,
      status: input.status,
      publish_at: input.publishAt || null,
      published_at: input.publishedAt,
      author: input.author || null,
      category_id: categoryId,
      featured: input.featured ?? false,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo crear la noticia.");
  return fetchNewsById(data.id);
}

export async function updateNews(id: string, input: Partial<AdminNews>): Promise<AdminNews> {
  const supabase = createClient();

  // Sin condicionales "si viene definido": mismo motivo que en
  // events/campuses/ministries — este método siempre se llama con el
  // formulario completo, y saltarse campos "vacíos" impedía borrarlos de
  // verdad en la base de datos.
  const patch: Record<string, unknown> = {
    title: input.title,
    summary: input.summary?.trim() || (input.content ? input.content.slice(0, 140) : undefined),
    content: input.content,
    image_url: input.imageSrc || null,
    status: input.status,
    publish_at: input.publishAt || null,
    published_at: input.publishedAt,
    author: input.author || null,
    featured: input.featured ?? false,
    category_id: await resolveCategoryId(input.category),
  };

  const { error } = await supabase.from("news").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  return fetchNewsById(id);
}

export async function duplicateNews(article: AdminNews, existingSlugs: string[]): Promise<AdminNews> {
  const supabase = createClient();
  const slug = uniqueSlug(`${article.slug}-copia`, existingSlugs, "noticia");
  const categoryId = await resolveCategoryId(article.category);

  const { data, error } = await supabase
    .from("news")
    .insert({
      slug,
      title: `${article.title} (copia)`,
      summary: article.summary,
      content: article.content,
      image_url: article.imageSrc || null,
      status: "draft",
      publish_at: null,
      published_at: article.publishedAt,
      author: article.author || null,
      category_id: categoryId,
      featured: article.featured ?? false,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo duplicar la noticia.");
  return fetchNewsById(data.id);
}

export async function setNewsStatus(
  id: string,
  status: "draft" | "published" | "scheduled" | "archived"
): Promise<AdminNews> {
  const supabase = createClient();
  const { error } = await supabase.from("news").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  return fetchNewsById(id);
}
