export function formatNewsDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

// Reexportada desde lib/readingTime.ts — se movió ahí porque Eventos
// también la usa ahora, no solo Noticias. Se reexporta acá para no romper
// los imports ya existentes (NewsCard, NewsTemplate).
export { formatReadingTime } from "@/lib/readingTime";
