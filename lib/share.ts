/**
 * Enlaces para "compartir esta página" a cualquier contacto/red — distinto de
 * lib/whatsapp.ts, que construye mensajes dirigidos al WhatsApp de New Life.
 */
export function buildWhatsAppShareLink(message: string) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function buildFacebookShareLink(url: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}
