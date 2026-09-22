/** 0 = domingo, igual que Date.getDay() — así se puede comparar directo contra una fecha real. */
export const DAY_OF_WEEK_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function dayOfWeekLabel(day: number): string {
  return DAY_OF_WEEK_LABELS[day] ?? "";
}
