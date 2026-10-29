const WORDS_PER_MINUTE = 200;

// Palabras / 200 ppm, redondeado, mínimo 1 minuto. Se movió fuera de
// lib/news.ts porque Eventos también la usa — no es solo de Noticias.
export function formatReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min de lectura`;
}
