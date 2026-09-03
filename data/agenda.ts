/**
 * Horarios recurrentes de la agenda — hoy solo los cultos dominicales fijos.
 * Vive en /data como el resto del contenido (ver data/events.ts, data/news.ts):
 * cuando exista un panel de configuración/backend, esto se reemplaza por
 * datos reales sin tocar lib/agenda.ts ni los componentes que lo consumen.
 */
export interface RecurringService {
  slug: string;
  /** "HH:MM" en 24 horas, solo para ordenar dentro del día. */
  sortTime: string;
  /** Etiqueta legible, ej. "7:30 a. m.". */
  time: string;
  title: string;
  description: string;
  /** Slug de data/campuses.ts. */
  campusSlug: string;
}

export const sundayServices: RecurringService[] = [
  {
    slug: "domingo-0730",
    sortTime: "07:30",
    time: "7:30 a. m.",
    title: "Culto Dominical",
    description: "Servicio de la mañana",
    campusSlug: "principal",
  },
  {
    slug: "domingo-1030",
    sortTime: "10:30",
    time: "10:30 a. m.",
    title: "Culto Dominical",
    description: "Servicio de la mañana",
    campusSlug: "principal",
  },
  {
    slug: "domingo-1700",
    sortTime: "17:00",
    time: "5:00 p. m.",
    title: "Culto Dominical",
    description: "Servicio de la tarde",
    campusSlug: "principal",
  },
];
