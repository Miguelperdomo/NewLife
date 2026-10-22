const WORDS_PER_MINUTE = 200;

/**
 * Estimación clásica: palabras del texto / 200 ppm, redondeado, mínimo 1
 * minuto. Vive aparte de lib/news.ts (que la reexporta para no romper nada
 * ya importado de ahí) porque ahora también la usan Eventos — no es algo
 * propio de Noticias, es un cálculo genérico sobre cualquier texto largo.
 */
export function formatReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min de lectura`;
}
