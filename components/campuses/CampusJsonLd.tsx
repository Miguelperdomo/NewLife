import { resolveCampusCoordinates } from "@/lib/maps";
import type { Campus } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// schema.org pide el día en inglés, sin importar el idioma del sitio — 0 =
// domingo, igual que Campus.schedules[].dayOfWeek (y que Date.getDay()).
const SCHEMA_DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Datos estructurados (schema.org/Church) de una sede — le dicen a Google
 * (y a asistentes de IA que leen schema.org) que esto es un lugar de culto
 * real, con esta dirección, coordenadas, teléfono y horarios, en un formato
 * que las máquinas entienden directo, sin tener que "adivinar" leyendo el
 * texto de la página. Esto es lo que ayuda a aparecer en Google Maps y en
 * búsquedas por ubicación ("iglesia cerca de mí"), además del SEO normal.
 */
export function CampusJsonLd({ campus }: { campus: Campus }) {
  const coords = resolveCampusCoordinates(campus.mapQuery);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: campus.fullName,
    url: `${SITE_URL}/sedes/${campus.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: campus.address,
      addressLocality: campus.city || undefined,
      addressCountry: "CO",
    },
    geo: coords
      ? {
          "@type": "GeoCoordinates",
          latitude: coords.lat,
          longitude: coords.lng,
        }
      : undefined,
    telephone: campus.whatsappNumber || undefined,
    // imageSrc puede ser una URL completa (Supabase Storage) o una ruta local
    // (/img/...) — solo se le antepone el dominio en el segundo caso.
    image: campus.imageSrc
      ? campus.imageSrc.startsWith("http")
        ? campus.imageSrc
        : `${SITE_URL}${campus.imageSrc}`
      : undefined,
    openingHoursSpecification: (campus.schedules ?? []).map((schedule) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${SCHEMA_DAY_NAMES[schedule.dayOfWeek]}`,
      opens: schedule.time,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
