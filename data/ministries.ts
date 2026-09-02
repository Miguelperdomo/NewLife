import type { Ministry } from "@/lib/types";

// [CONTENIDO TEMPORAL] Reemplazar con la información oficial de cada ministerio de New Life.
export const ministries: Ministry[] = [
  {
    slug: "jovenes",
    name: "New Gen",
    shortDescription:
      "Un espacio para adolescentes y jóvenes que quieren vivir su fe con propósito.",
    description:
      "[CONTENIDO TEMPORAL] New Gen es el ministerio donde adolescentes y jóvenes crecen en su relación con Dios, construyen amistades reales y descubren su propósito, en un ambiente cercano, divertido y sin prejuicios.",
    audience: "Adolescentes y jóvenes de 13 a 25 años.",
    schedule: "[HORARIO — PLACEHOLDER] Sábados, 7:00 p. m.",
    location: "[LUGAR — PLACEHOLDER] Sede principal, salón juvenil.",
    leader: "[RESPONSABLE — PLACEHOLDER]",
    imageLabel: "Logo de New Gen",
    imageSrc: "/img/newgen.jpeg",
    social: [{ platform: "instagram", label: "Instagram", url: "#" }],
  },
  {
    slug: "ninos",
    name: "New Kids",
    shortDescription:
      "Un lugar seguro y divertido donde los más pequeños conocen el amor de Dios.",
    description:
      "[CONTENIDO TEMPORAL] New Kids acompaña a los más pequeños de la casa con clases dinámicas, juegos y enseñanzas bíblicas adaptadas a cada edad, mientras sus padres disfrutan del servicio.",
    audience: "Niños de 0 a 12 años.",
    schedule: "[HORARIO — PLACEHOLDER] Domingos, durante el servicio principal.",
    location: "[LUGAR — PLACEHOLDER] Sede principal, área infantil.",
    leader: "[RESPONSABLE — PLACEHOLDER]",
    imageLabel: "Logo de New Kids",
    imageSrc: "/img/newkids.jpeg",
  },
  {
    slug: "mujeres",
    name: "New Womans",
    shortDescription:
      "Una comunidad de mujeres que crecen juntas en fe, propósito e identidad.",
    description:
      "[CONTENIDO TEMPORAL] New Womans es un espacio de encuentro, estudio bíblico y amistad donde cada mujer puede crecer en su identidad y propósito en Cristo.",
    audience: "Mujeres de todas las edades.",
    schedule: "[HORARIO — PLACEHOLDER] Martes, 7:00 p. m.",
    location: "[LUGAR — PLACEHOLDER] Sede principal.",
    leader: "[RESPONSABLE — PLACEHOLDER]",
    imageLabel: "[FOTOGRAFÍA NEW WOMANS]",
  },
  {
    slug: "hombres",
    name: "Hombres",
    shortDescription: "Un espacio para hombres que buscan crecer en integridad y liderazgo.",
    description:
      "[CONTENIDO TEMPORAL] El ministerio de Hombres fortalece a cada hombre en su rol como líder, esposo, padre e hijo de Dios, a través de la comunidad y la Palabra.",
    audience: "Hombres de todas las edades.",
    schedule: "[HORARIO — PLACEHOLDER] Sábados, 8:00 a. m.",
    location: "[LUGAR — PLACEHOLDER] Sede principal.",
    leader: "[RESPONSABLE — PLACEHOLDER]",
    imageLabel: "[FOTOGRAFÍA MINISTERIO DE HOMBRES]",
  },
  {
    slug: "maravillosos",
    name: "Años Maravillosos",
    shortDescription:
      "Una comunidad para adultos mayores que siguen escribiendo su historia con Dios.",
    description:
      "[CONTENIDO TEMPORAL] Años Maravillosos acompaña a los adultos mayores de New Life con un espacio de comunidad, enseñanza y propósito, celebrando esta etapa de la vida en familia.",
    audience: "Hombres y mujeres mayores de 50 años.",
    schedule: "[HORARIO — PLACEHOLDER] Sábados, 8:00 a. m.",
    location: "[LUGAR — PLACEHOLDER] Sede principal.",
    leader: "[RESPONSABLE — PLACEHOLDER]",
    imageLabel: "[FOTOGRAFÍA AÑOS MARAVILLOSOS]",
  },
  {
    slug: "alabanza",
    name: "Alabanza",
    shortDescription:
      "El equipo de música y adoración que guía a la iglesia a encontrarse con Dios.",
    description:
      "[CONTENIDO TEMPORAL] El ministerio de Alabanza reúne a músicos, cantantes y técnicos que sirven con sus talentos para crear momentos de adoración genuina cada semana.",
    audience: "Músicos, cantantes y técnicos de sonido de todas las edades.",
    schedule: "[HORARIO — PLACEHOLDER] Ensayos: miércoles, 7:00 p. m.",
    location: "[LUGAR — PLACEHOLDER] Sede principal, sala de música.",
    leader: "[RESPONSABLE — PLACEHOLDER]",
    imageLabel: "[FOTOGRAFÍA MINISTERIO DE ALABANZA]",
    social: [{ platform: "youtube", label: "YouTube", url: "#" }],
  },
  {
    slug: "intercesion",
    name: "Intercesión",
    shortDescription:
      "El equipo que sostiene en oración a New Life y a cada petición de la comunidad.",
    description:
      "[CONTENIDO TEMPORAL] Intercesión es el ministerio de oración de New Life: cubre en oración los servicios, cada petición de la comunidad y el crecimiento de la iglesia.",
    audience: "Personas con un llamado a la oración e intercesión.",
    schedule: "[HORARIO — PLACEHOLDER] Sábados, 8:00 a. m.",
    location: "[LUGAR — PLACEHOLDER] Sede principal, sala de oración.",
    leader: "[RESPONSABLE — PLACEHOLDER]",
    imageLabel: "[FOTOGRAFÍA INTERCESIÓN]",
  },
  {
    slug: "voluntariado",
    name: "Voluntariado",
    shortDescription:
      "Sirve con tus dones y talentos en los distintos equipos de New Life.",
    description:
      "[CONTENIDO TEMPORAL] El ministerio de Voluntariado conecta a cada persona con un equipo donde pueda servir según sus talentos: recepción, logística, medios, alabanza y más.",
    audience: "Toda persona que quiera servir en la iglesia.",
    schedule: "[HORARIO — PLACEHOLDER] Según el equipo asignado.",
    location: "[LUGAR — PLACEHOLDER] Todas las sedes.",
    leader: "[RESPONSABLE — PLACEHOLDER]",
    imageLabel: "[FOTOGRAFÍA VOLUNTARIADO]",
  },
  {
    slug: "life-missions",
    name: "Life Missions",
    shortDescription:
      "El brazo misionero de New Life, llevando esperanza más allá de nuestras puertas.",
    description:
      "[CONTENIDO TEMPORAL] Life Missions organiza y apoya jornadas misioneras, locales e internacionales, para llevar el mensaje de New Life más allá de nuestras sedes.",
    audience: "Toda persona con un llamado a las misiones.",
    schedule: "[HORARIO — PLACEHOLDER]",
    location: "[LUGAR — PLACEHOLDER] Todas las sedes.",
    leader: "[RESPONSABLE — PLACEHOLDER]",
    imageLabel: "[FOTOGRAFÍA LIFE MISSIONS]",
  },
];
