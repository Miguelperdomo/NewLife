export type EventStatus = "hoy" | "proximo" | "finalizado";

export function todayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Comparamos los strings "YYYY-MM-DD" tal cual (ordenan igual que las fechas),
// así nos ahorramos líos de zona horaria con Date. Un evento de varios días
// cuenta como "hoy" en cualquier punto del rango.
export function getEventStatus(date: string, endDate?: string): EventStatus {
  const today = todayISO();
  const effectiveEnd = endDate ?? date;
  if (today >= date && today <= effectiveEnd) return "hoy";
  return today < date ? "proximo" : "finalizado";
}

/** Días hasta `date` (0 = hoy, negativo = ya pasó). Compara a medianoche para que no varíe según la hora del día. */
export function getDaysUntil(date: string): number {
  const today = new Date(`${todayISO()}T00:00:00`);
  const target = new Date(`${date}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}

function formatSingleDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  const formatted = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(parsed);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatTimeLabel(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const parsed = new Date(2000, 0, 1, hours, minutes);
  return new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "2-digit", hour12: true }).format(parsed);
}

/** "19:00"/"21:00" del admin -> "7:00 p. m." o "7:00 p. m. – 9:00 p. m." */
export function formatEventTime(startTime?: string, endTime?: string): string | undefined {
  if (!startTime) return undefined;
  const start = formatTimeLabel(startTime);
  return endTime ? `${start} – ${formatTimeLabel(endTime)}` : start;
}

export function formatEventDate(date: string, endDate?: string) {
  if (!endDate || endDate === date) return formatSingleDate(date);

  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  const startLabel = new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: sameMonth ? undefined : "long",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long" }).format(end);

  return `${startLabel} – ${endLabel}`;
}
