export function formatNewsDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

const WORDS_PER_MINUTE = 200;

/** Estimación clásica: palabras del contenido / 200 ppm, redondeado, mínimo 1 minuto. */
export function formatReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min de lectura`;
}
