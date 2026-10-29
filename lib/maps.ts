// Links directos a Google Maps, sin API key. No metemos reseñas embebidas
// porque eso necesitaría la API de Places (con facturación propia) —
// mejor enlazar directo a la ficha real en Maps.
export function googleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsDirectionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

/** iframe embebido sin API key, solo muestra el punto */
export function googleMapsEmbedUrl(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

// Si mapQuery ya es "lat,lng" (lo normal cuando se pegó un link de Maps al
// crear la sede), lo separa en números para el mapa propio con Leaflet.
// Si es una dirección escrita a mano, null — no hay pin en el mapa conjunto
// para esa sede, pero su página individual sigue funcionando igual.
export function parseLatLng(mapQuery: string): { lat: number; lng: number } | null {
  const match = mapQuery.trim().match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  return { lat: Number(match[1]), lng: Number(match[2]) };
}

// Igual que parseLatLng pero también intenta sacar coordenadas de un link
// completo de Maps (sedes viejas cargadas antes de que MapLocationField
// extrajera el valor solo). Usar esta, no parseLatLng directo.
export function resolveCampusCoordinates(mapQuery: string): { lat: number; lng: number } | null {
  const direct = parseLatLng(mapQuery);
  if (direct) return direct;

  const fromUrl = extractCoordinatesFromMapsUrl(mapQuery);
  return fromUrl ? parseLatLng(fromUrl) : null;
}

/** ¿Es un link de Maps (largo o corto), no una dirección escrita a mano? */
export function looksLikeGoogleMapsUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return (
      url.hostname === "goo.gl" ||
      url.hostname === "maps.app.goo.gl" ||
      url.hostname === "google.com" ||
      url.hostname === "www.google.com" ||
      url.hostname === "maps.google.com"
    );
  } catch {
    return false;
  }
}

// Saca "lat,lng" de un link LARGO de Maps (los cortos tipo maps.app.goo.gl
// hay que expandirlos antes, ver app/api/resolve-maps-link). Probamos en
// este orden porque importa cuál gana:
//   1. "!3dlat!4dlng" — el pin exacto, el que trae el botón "Compartir" del celular.
//   2. "@lat,lng,17z" — el centro de la vista del mapa, puede estar corrido si
//      la persona movió/hizo zoom antes de copiar.
//   3. "q="/"ll=" — links de búsqueda.
// Antes mirábamos "@lat,lng" primero y el pin quedaba corrido en sedes
// cargadas con un link "Compartir" del celular — por eso el orden importa.
export function extractCoordinatesFromMapsUrl(url: string): string | null {
  const dataMatch = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (dataMatch) return `${dataMatch[1]},${dataMatch[2]}`;

  const atMatch = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) return `${atMatch[1]},${atMatch[2]}`;

  const queryMatch = url.match(/[?&](?:q|ll|destination)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (queryMatch) return `${queryMatch[1]},${queryMatch[2]}`;

  return null;
}
