import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** ¿`dateISO` ("YYYY-MM-DD" o con hora) cayó dentro de los últimos `days` días? Para insignias tipo "Nuevo". */
export function isWithinDays(dateISO: string, days: number): boolean {
  const diffMs = Date.now() - new Date(dateISO).getTime();
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
}
