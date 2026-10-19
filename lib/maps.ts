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

/**
 * Si `mapQuery` ya quedó guardado como "lat,lng" (lo normal cuando se pegó
 * un link de Google Maps al crear la sede — ver MapLocationField), lo separa
 * en números listos para ubicarlo en un mapa propio (Leaflet, sin API key).
 * Si es una dirección escrita a mano, devuelve null: ese caso no se puede
 * ubicar sin volver a geocodificar, así que simplemente no se le pone pin en
 * el mapa conjunto (su página individual de sede sigue funcionando igual,
 * esa sí acepta texto libre).
 */
export function parseLatLng(mapQuery: string): { lat: number; lng: number } | null {
  const match = mapQuery.trim().match(/^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  return { lat: Number(match[1]), lng: Number(match[2]) };
}

/**
 * Igual que parseLatLng, pero también intenta sacar coordenadas si `mapQuery`
 * quedó guardado como un link completo de Google Maps en vez de "lat,lng" ya
 * separado (pasa con sedes antiguas o de prueba cargadas antes de que
 * MapLocationField extrajera el valor automáticamente). Esto es lo que debe
 * usarse para ubicar sedes en un mapa propio — parseLatLng solo cubre el
 * caso ya limpio.
 */
export function resolveCampusCoordinates(mapQuery: string): { lat: number; lng: number } | null {
  const direct = parseLatLng(mapQuery);
  if (direct) return direct;

  const fromUrl = extractCoordinatesFromMapsUrl(mapQuery);
  return fromUrl ? parseLatLng(fromUrl) : null;
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
 * dónde se copie el link, EN ESTE ORDEN DE PRIORIDAD a propósito:
 *
 * 1. "!3dlat!4dlng" (dentro del parámetro `data`) — el punto EXACTO del
 *    lugar/pin. Es el más preciso y el que trae un link compartido desde la
 *    app de Google Maps ("Compartir" → "Copiar enlace").
 * 2. "@lat,lng,17z" (barra de dirección del navegador) — el CENTRO de la
 *    vista del mapa, no el pin en sí. Puede quedar corrido unos metros si la
 *    persona movió o hizo zoom al mapa antes de copiar el link.
 * 3. "q=lat,lng"/"ll=lat,lng" (links de búsqueda/dirección).
 *
 * Antes se revisaba "@lat,lng" primero, lo que a veces guardaba el centro
 * del mapa en vez del punto exacto del lugar — por eso el pin quedaba
 * corrido en sedes creadas pegando un link "Compartir" desde el celular.
 * Si no encuentra ninguno, devuelve null.
 */
export function extractCoordinatesFromMapsUrl(url: string): string | null {
  const dataMatch = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (dataMatch) return `${dataMatch[1]},${dataMatch[2]}`;

  const atMatch = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) return `${atMatch[1]},${atMatch[2]}`;

  const queryMatch = url.match(/[?&](?:q|ll|destination)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (queryMatch) return `${queryMatch[1]},${queryMatch[2]}`;

  return null;
}
