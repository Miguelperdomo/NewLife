/**
 * Links directos a Google Maps (sin necesitar una API key). No incrustamos el
 * texto de las reseñas porque eso requeriría la API de Google Places (con
 * key y facturación propias de New Life) — en su lugar, enlazamos a la ficha
 * real del lugar en Maps, donde cualquiera puede leer y dejar reseñas.
 */
export function googleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsDirectionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

/** Mapa embebido (iframe) sin API key — suficiente para mostrar el punto, sin reseñas ni Street View interactivo. */
export function googleMapsEmbedUrl(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

/** ¿El texto que la persona pegó es un link de Google Maps (largo o corto), no una dirección escrita a mano? */
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

/**
 * Saca "lat,lng" de un link LARGO de Google Maps (el que sí trae
 * coordenadas visibles en la URL, a diferencia de los cortos
 * maps.app.goo.gl — esos hay que expandirlos primero, ver
 * app/api/resolve-maps-link). Cubre los 3 formatos que Google usa según de
 * dónde se copie el link: "@lat,lng,17z" (barra de dirección), "!3dlat!4dlng"
 * (dentro del parámetro `data`), y "q=lat,lng"/"ll=lat,lng" (links de
 * búsqueda/dirección). Si no encuentra ninguno, devuelve null.
 */
export function extractCoordinatesFromMapsUrl(url: string): string | null {
  const atMatch = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) return `${atMatch[1]},${atMatch[2]}`;

  const dataMatch = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (dataMatch) return `${dataMatch[1]},${dataMatch[2]}`;

  const queryMatch = url.match(/[?&](?:q|ll|destination)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (queryMatch) return `${queryMatch[1]},${queryMatch[2]}`;

  return null;
}
