import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Le dice a los buscadores qué SÍ pueden indexar (todo el sitio público) y
 * qué NO (el panel administrativo) — sin esto, en teoría Google podría llegar
 * a mostrar /admin en resultados de búsqueda si alguien lo enlaza desde otro
 * lado. La seguridad real la sigue dando el login, esto es solo una señal
 * educada para buscadores que la respetan.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
