import type { MetadataRoute } from "next";
import { getCampuses, getMinistries, getPastors } from "@/lib/content";
import { getEvents } from "@/lib/eventsContent";
import { getNews } from "@/lib/newsContent";

// Mismo patrón de respaldo que app/layout.tsx (metadataBase): sin dominio
// propio todavía, NEXT_PUBLIC_SITE_URL queda pendiente de fijar en el hosting.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/nosotros", changeFrequency: "monthly", priority: 0.7 },
  { path: "/ministerios", changeFrequency: "weekly", priority: 0.8 },
  { path: "/eventos", changeFrequency: "daily", priority: 0.9 },
  { path: "/noticias", changeFrequency: "daily", priority: 0.8 },
  { path: "/sedes", changeFrequency: "monthly", priority: 0.7 },
  { path: "/pastores", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terminos", changeFrequency: "yearly", priority: 0.2 },
];

/**
 * Mapa del sitio para buscadores — junta las rutas fijas con cada
 * ministerio/sede/pastor/evento/noticia real que exista en Supabase, para
 * que Google los descubra todos de una vez en vez de tener que seguir links.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [ministries, campuses, pastors, events, news] = await Promise.all([
    getMinistries(),
    getCampuses(),
    getPastors(),
    getEvents(),
    getNews(),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...ministries.map((ministry) => ({
      url: `${siteUrl}/ministerios/${ministry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...campuses.map((campus) => ({
      url: `${siteUrl}/sedes/${campus.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...pastors.map((pastor) => ({
      url: `${siteUrl}/pastores/${pastor.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...events.map((event) => ({
      url: `${siteUrl}/eventos/${event.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...news.map((article) => ({
      url: `${siteUrl}/noticias/${article.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
