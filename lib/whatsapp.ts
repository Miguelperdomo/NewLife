// link wa.me con mensaje pre-escrito, la persona solo da enviar
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

/** como eventInscriptionMessage pero con nombre y sede — form "Quiero asistir" del Hero */
export function eventAttendanceMessage(eventName: string, name: string, campusName: string) {
  return `Hola New Life, soy ${name} y quiero asistir al evento "${eventName}" en ${campusName}.`;
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

// "contacto" en un pedido de oración es texto libre (espacios, guiones,
// indicativo, o un correo). Esto intenta reconocer si de verdad es un
// WhatsApp; si no, devuelve null y no se intenta abrir WhatsApp.
export function normalizeWhatsAppNumber(contact: string): string | null {
  if (contact.includes("@")) return null;
  const digits = contact.replace(/\D/g, "");
  if (digits.length < 7) return null;
  // celular colombiano sin indicativo (10 dígitos, empieza por 3)
  if (digits.length === 10 && digits.startsWith("3")) return `57${digits}`;
  return digits;
}

export function prayerRequestFollowUpMessage(name?: string | null) {
  // sin emoji: el 🙏 se veía como "�" en algunos celulares
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
