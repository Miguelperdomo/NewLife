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
