const OVERDUE_DAYS = 3;
const OVERDUE_MS = OVERDUE_DAYS * 24 * 60 * 60 * 1000;

/** Más de 3 días sin atenderse (se usa en Oración y Bautismo). */
export function isOverdue(createdAt: string, status: "nueva" | "atendida"): boolean {
  return status === "nueva" && Date.now() - new Date(createdAt).getTime() > OVERDUE_MS;
}

/** Lo vencido primero — sort es estable, así que dentro de cada grupo queda el orden de siempre. */
export function sortOverdueFirst<T extends { createdAt: string; status: "nueva" | "atendida" }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => Number(isOverdue(b.createdAt, b.status)) - Number(isOverdue(a.createdAt, a.status)));
}
