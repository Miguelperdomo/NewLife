/**
 * Construye un link de "click to chat" de WhatsApp (wa.me) con un mensaje
 * pre-escrito, para que la persona solo tenga que presionar enviar.
 */
export function buildWhatsAppLink(phoneNumber: string, message: string) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function ministryInscriptionMessage(ministryName: string) {
  return `Hola New Life, quiero inscribirme en "${ministryName}".`;
}

export function eventInscriptionMessage(eventName: string, ministryName?: string) {
  const base = `Hola New Life, quiero inscribirme en el evento "${eventName}".`;
  return ministryName ? `${base} Ministerio: ${ministryName}.` : base;
}

export function campusInquiryMessage(campusName: string) {
  return `Hola New Life, tengo una pregunta sobre la ${campusName}.`;
}
