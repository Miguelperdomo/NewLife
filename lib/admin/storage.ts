import { getEvents, getNews } from "@/lib/content";
import type { AdminEvent, AdminNews } from "@/lib/admin/types";

const STORAGE_KEY = "newlife-admin-content-v1";

interface AdminStore {
  events: AdminEvent[];
  news: AdminNews[];
}

/**
 * Capa de persistencia mock (localStorage) — todavía pendiente de migrar a
 * Supabase (a diferencia de Configuración y Sedes, ver lib/admin/siteSettings.ts
 * y lib/admin/campuses.ts). El resto del módulo admin (hook, formularios,
 * tablas) sigue igual, ya que hablan con `useAdminContent()`, no directamente
 * con `localStorage`.
 */
function seedStore(): AdminStore {
  const now = new Date().toISOString();

  const events: AdminEvent[] = getEvents().map((event) => ({
    id: crypto.randomUUID(),
    slug: event.slug,
    title: event.name,
    description: event.description,
    imageSrc: event.imageSrc,
    status: "published",
    startDate: event.date,
    endDate: event.endDate,
    startTime: event.time,
    campus: event.campus,
    location: event.location,
    audience: event.ministry ? { mode: "specific", ministrySlugs: [event.ministry] } : { mode: "general" },
    featured: false,
    createdAt: now,
    updatedAt: now,
  }));

  const news: AdminNews[] = getNews().map((article) => ({
    id: crypto.randomUUID(),
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    content: article.content,
    imageSrc: article.imageSrc,
    status: "published",
    publishedAt: article.publishedAt,
    author: article.author,
    category: article.category,
    featured: article.featured,
    createdAt: now,
    updatedAt: now,
  }));

  return { events, news };
}

export function loadStore(): AdminStore {
  if (typeof window === "undefined") {
    return { events: [], news: [] };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedStore();
    saveStore(seeded);
    return seeded;
  }

  try {
    return JSON.parse(raw) as AdminStore;
  } catch {
    const seeded = seedStore();
    saveStore(seeded);
    return seeded;
  }
}

export function saveStore(store: AdminStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
