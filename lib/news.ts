export function formatNewsDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

// Vive en lib/readingTime.ts ahora (Eventos también la usa), reexportada
// acá para no romper NewsCard/NewsTemplate.
export { formatReadingTime } from "@/lib/readingTime";
