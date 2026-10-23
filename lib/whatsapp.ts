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

export function helpInquiryMessage(optionTitle: string) {
  return `Hola New Life, quiero ayudar con: "${optionTitle}".`;
}

export function pastorInquiryMessage(pastorName: string) {
  return `Hola, quisiera comunicarme con ${pastorName}.`;
}

/**
 * El campo "contacto" de un pedido de oración es texto libre — puede traer
 * espacios, guiones, indicativo, o ser directamente un correo. Esto intenta
 * reconocer si de verdad es un número de WhatsApp; si parece un correo o no
 * tiene suficientes dígitos para ser un teléfono real, devuelve null (no se
 * intenta abrir WhatsApp en esos casos).
 */
export function normalizeWhatsAppNumber(contact: string): string | null {
  if (contact.includes("@")) return null;
  const digits = contact.replace(/\D/g, "");
  if (digits.length < 7) return null;
  // Celular colombiano típico escrito sin el indicativo (10 dígitos, empieza por 3).
  if (digits.length === 10 && digits.startsWith("3")) return `57${digits}`;
  return digits;
}

export function prayerRequestFollowUpMessage(name?: string | null) {
  // Sin emoji a propósito — el 🙏 se veía como "�" en algunos celulares/clientes de WhatsApp.
  return `Hola${name ? ` ${name}` : ""}, somos del equipo de New Life. Ya oramos por tu petición — cualquier cosa que necesites, aquí estamos para ti.`;
}

export function baptismRequestFollowUpMessage(name: string) {
  return `Hola ${name}, somos del equipo de New Life. Vimos que quieres bautizarte — queremos contarte los próximos pasos y acompañarte en esto.`;
}

export function visitCheckinFollowUpMessage(name: string, isPastor: boolean) {
  return isPastor
    ? `Hola Pastor(a) ${name}, somos del equipo de New Life. Gracias por avisarnos que nos visita — ya quedamos pendientes para recibirlo como corresponde.`
    : `Hola ${name}, somos del equipo de bienvenida de New Life. Gracias por avisarnos que vienes — te vamos a estar esperando.`;
}
