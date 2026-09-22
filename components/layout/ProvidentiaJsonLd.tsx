import { siteConfig } from "@/data/site";

/**
 * Datos estructurados (schema.org) que le dicen a Google/buscadores quién
 * construyó el sitio — invisible al navegar, pero legible para herramientas
 * SEO. Mismo patrón de escape que Breadcrumbs.tsx (JSON.stringify no escapa
 * "<", así que se reemplaza por su escape unicode antes de inyectarlo).
 */
export function ProvidentiaJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    creator: {
      "@type": "Organization",
      name: "Providentia Tech",
      url: "https://wa.me/573133854821",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ibagué",
        addressCountry: "CO",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
