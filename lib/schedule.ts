import type { ServiceSchedule } from "@/lib/types";

/** 0 = domingo, igual que Date.getDay() */
export const DAY_OF_WEEK_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function dayOfWeekLabel(day: number): string {
  return DAY_OF_WEEK_LABELS[day] ?? "";
}

/** Minutos hasta la próxima vez que cae este horario (0 = está pasando ahora) */
export function minutesUntilNextService(dayOfWeek: number, time: string, now: Date): number {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const [hours, minutes] = time.split(":").map(Number);
  const targetMinutes = hours * 60 + minutes;
  let dayDiff = (dayOfWeek - now.getDay() + 7) % 7;
  if (dayDiff === 0 && targetMinutes <= nowMinutes) dayDiff = 7;
  return dayDiff * 24 * 60 + (targetMinutes - nowMinutes);
}

/** El horario más próximo entre varios, para resaltar "Próximo" en una sede */
export function findNextService(services: ServiceSchedule[], now: Date): ServiceSchedule | undefined {
  let best: ServiceSchedule | undefined;
  let bestMinutes = Infinity;
  for (const service of services) {
    const minutes = minutesUntilNextService(service.dayOfWeek, service.time, now);
    if (minutes < bestMinutes) {
      bestMinutes = minutes;
      best = service;
    }
  }
  return best;
}
