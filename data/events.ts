import type { ChurchEvent } from "@/lib/types";

// [CONTENIDO TEMPORAL — EVENTOS DE EJEMPLO] Estos 6 eventos son solo para
// probar el diseño y la lógica de filtros/estados. No representan actividades
// oficiales confirmadas de New Life — reemplazar por los eventos reales.
export const events: ChurchEvent[] = [
  {
    slug: "noche-new-gen",
    name: "Noche New Gen",
    category: "Reunión",
    ministry: "jovenes",
    date: "2026-09-05",
    time: "7:00 p. m.",
    campus: "principal",
    location: "Salón juvenil",
    shortDescription:
      "Una noche de alabanza, palabra y comunidad para todos los jóvenes de New Life.",
    description:
      "[CONTENIDO TEMPORAL — EVENTO DE EJEMPLO] Únete a la Noche New Gen: un espacio de alabanza, enseñanza y conexión para adolescentes y jóvenes. Trae a un amigo.",
    imageLabel: "[FOTOGRAFÍA NOCHE NEW GEN]",
  },
  {
    slug: "domingo-new-kids",
    name: "Domingo de Aventuras New Kids",
    category: "Actividad",
    ministry: "ninos",
    date: "2026-09-06",
    time: "10:00 a. m.",
    campus: "principal",
    location: "Área infantil",
    shortDescription:
      "Juegos, música y una enseñanza bíblica pensada para los más pequeños de la casa.",
    description:
      "[CONTENIDO TEMPORAL — EVENTO DE EJEMPLO] Un domingo especial para New Kids, con actividades y una historia bíblica que los niños van a recordar.",
    imageLabel: "[FOTOGRAFÍA DOMINGO NEW KIDS]",
  },
  {
    slug: "encuentro-new-womans",
    name: "Encuentro New Womans",
    category: "Encuentro",
    ministry: "mujeres",
    date: "2026-09-09",
    time: "7:00 p. m.",
    campus: "vasconia",
    location: "Salón principal",
    shortDescription: "Una noche de adoración y enseñanza para todas las mujeres de New Life.",
    description:
      "[CONTENIDO TEMPORAL — EVENTO DE EJEMPLO] El Encuentro New Womans es un espacio para conectar, orar y crecer juntas en comunidad.",
    imageLabel: "[FOTOGRAFÍA ENCUENTRO NEW WOMANS]",
  },
  {
    slug: "ensayo-alabanza",
    name: "Ensayo General de Alabanza",
    category: "Ensayo",
    ministry: "alabanza",
    date: "2026-09-01",
    time: "7:00 p. m.",
    campus: "principal",
    location: "Sala de música",
    shortDescription:
      "Ensayo abierto para todo el equipo de música y nuevos integrantes interesados.",
    description:
      "[CONTENIDO TEMPORAL — EVENTO DE EJEMPLO] Ensayo general del equipo de Alabanza. Si tocas un instrumento o cantas y quieres conocer el equipo, este es un buen punto de partida.",
    imageLabel: "[FOTOGRAFÍA ENSAYO DE ALABANZA]",
  },
  {
    slug: "vigilia-intercesion",
    name: "Vigilia de Intercesión",
    category: "Oración",
    ministry: "intercesion",
    date: "2026-09-12",
    endDate: "2026-09-13",
    time: "6:00 p. m.",
    campus: "principal",
    location: "Sala de oración",
    shortDescription:
      "Una noche dedicada a orar por New Life, por nuestra ciudad y por cada petición de la comunidad.",
    description:
      "[CONTENIDO TEMPORAL — EVENTO DE EJEMPLO] Ven a buscar a Dios en oración junto al equipo de Intercesión. Abierto a toda la iglesia.",
    imageLabel: "[FOTOGRAFÍA VIGILIA DE INTERCESIÓN]",
  },
  {
    slug: "culto-aniversario",
    name: "Culto Especial de Aniversario",
    category: "Servicio especial",
    // Sin `ministry`: evento general de toda la iglesia, no de un ministerio específico.
    date: "2026-08-20",
    time: "10:00 a. m.",
    campus: "principal",
    location: "Auditorio principal",
    shortDescription: "Un servicio especial de celebración para toda la iglesia.",
    description:
      "[CONTENIDO TEMPORAL — EVENTO DE EJEMPLO] Evento de ejemplo ya finalizado, usado para mostrar cómo se ven los eventos pasados en el sitio.",
    imageLabel: "[FOTOGRAFÍA CULTO ESPECIAL]",
    registrationByWhatsApp: false,
  },
];
