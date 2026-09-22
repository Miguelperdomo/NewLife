import type { NewsArticle } from "@/lib/types";

// [CONTENIDO TEMPORAL — NOTICIAS DE EJEMPLO] Estas 5 noticias son solo para
// probar el diseño. No representan comunicados oficiales de New Life —
// reemplazar por las noticias reales.
export const news: NewsArticle[] = [
  {
    slug: "nueva-pagina-web",
    title: "New Life estrena su nueva página web",
    summary:
      "Ya puedes conocer nuestros ministerios, sedes, eventos y transmisiones, todo en un solo lugar.",
    content:
      "[CONTENIDO TEMPORAL — NOTICIA DE EJEMPLO] Estamos muy contentos de compartir el lanzamiento de la nueva página web de New Life. Aquí podrás conocer nuestros ministerios, encontrar la sede más cercana, ver los próximos eventos y conectarte a nuestras transmisiones.\n\nEsto es solo el comienzo — seguiremos agregando contenido para que estés cada vez más cerca de tu comunidad.",
    publishedAt: "2026-09-01",
    category: "Anuncio",
    featured: true,
    imageLabel: "[FOTOGRAFÍA LANZAMIENTO WEB]",
  },
  {
    slug: "nuevo-horario-servicios",
    title: "Nuevo horario de servicios dominicales",
    summary: "A partir de este mes ajustamos el horario de nuestros servicios en la sede principal.",
    content:
      "[CONTENIDO TEMPORAL — NOTICIA DE EJEMPLO] Queremos contarte que a partir de este mes tendremos un nuevo horario para nuestros servicios dominicales en la Sede Principal.\n\nTe esperamos con la misma alegría de siempre.",
    publishedAt: "2026-08-25",
    category: "Anuncio",
    imageLabel: "[FOTOGRAFÍA NUEVO HORARIO]",
  },
  {
    slug: "balance-jornada-misionera",
    title: "Así vivimos la última jornada de Life Missions",
    summary: "Un vistazo a lo que Dios hizo a través del equipo de misiones este mes.",
    content:
      "[CONTENIDO TEMPORAL — NOTICIA DE EJEMPLO] El equipo de Life Missions se reunió recientemente para servir a nuestra comunidad. Fue un tiempo de servicio, unidad y mucho agradecimiento.\n\nGracias a cada persona que hizo parte de esta jornada.",
    publishedAt: "2026-08-15",
    category: "Misiones",
    author: "Equipo Life Missions",
    imageLabel: "[FOTOGRAFÍA JORNADA MISIONERA]",
  },
  {
    slug: "reflexion-un-nuevo-comienzo",
    title: "Reflexión: una nueva vida comienza aquí",
    summary: "Una breve reflexión sobre lo que significa comenzar de nuevo.",
    content:
      "[CONTENIDO TEMPORAL — NOTICIA DE EJEMPLO] Comenzar de nuevo no siempre es fácil, pero es una invitación que se repite todos los días. Esta semana queremos recordarte que, sin importar en qué punto estés, siempre hay una nueva oportunidad para caminar en fe.\n\nTe invitamos a acompañarnos y ser parte de esta comunidad.",
    publishedAt: "2026-08-10",
    category: "Reflexión",
    author: "Apóstol Giovany",
    imageLabel: "[FOTOGRAFÍA REFLEXIÓN]",
  },
  {
    slug: "campana-de-ayuda-comunitaria",
    title: "Campaña de ayuda comunitaria",
    summary: "Estamos organizando una jornada para apoyar a familias de nuestra comunidad.",
    content:
      "[CONTENIDO TEMPORAL — NOTICIA DE EJEMPLO] Estamos organizando una campaña para apoyar a familias de nuestra comunidad que lo necesitan. Muy pronto compartiremos cómo puedes ser parte.\n\nSi Dios pone en tu corazón ayudar, escríbenos.",
    publishedAt: "2026-08-05",
    imageLabel: "[FOTOGRAFÍA CAMPAÑA COMUNITARIA]",
  },
];
