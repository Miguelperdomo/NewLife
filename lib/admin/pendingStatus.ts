const OVERDUE_DAYS = 3;
const OVERDUE_MS = OVERDUE_DAYS * 24 * 60 * 60 * 1000;

/** ¿Lleva más de 3 días sin atenderse? Se usa en Oración y Bautismo para que lo olvidado no se pierda entre lo nuevo. */
export function isOverdue(createdAt: string, status: "nueva" | "atendida"): boolean {
  return status === "nueva" && Date.now() - new Date(createdAt).getTime() > OVERDUE_MS;
}

/** Ordena para que lo vencido quede primero — Array.sort es estable, así que dentro de cada grupo se mantiene el orden que ya traía (más reciente primero). */
export function sortOverdueFirst<T extends { createdAt: string; status: "nueva" | "atendida" }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => Number(isOverdue(b.createdAt, b.status)) - Number(isOverdue(a.createdAt, a.status)));
}
