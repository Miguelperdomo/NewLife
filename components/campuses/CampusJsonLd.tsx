import { resolveCampusCoordinates } from "@/lib/maps";
import type { Campus } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// schema.org quiere el día en inglés siempre; 0 = domingo igual que dayOfWeek/Date.getDay()
const SCHEMA_DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// datos estructurados schema.org/Church, ayuda a aparecer en Google Maps y
// búsquedas por ubicación ("iglesia cerca de mí")
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
    // imageSrc puede ser URL completa (Storage) o ruta local (/img/...), solo esta última necesita el dominio
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
