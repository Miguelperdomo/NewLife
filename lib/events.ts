export type EventStatus = "hoy" | "proximo" | "finalizado";

function todayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Compara strings "YYYY-MM-DD" directamente (orden lexicográfico == orden
 * cronológico en ese formato), evitando líos de zona horaria con `Date`.
 * Un evento con `endDate` (varios días) cuenta como "hoy" en cualquier día
 * dentro del rango, no solo en su fecha de inicio.
 */
export function getEventStatus(date: string, endDate?: string): EventStatus {
  const today = todayISO();
  const effectiveEnd = endDate ?? date;
  if (today >= date && today <= effectiveEnd) return "hoy";
  return today < date ? "proximo" : "finalizado";
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
