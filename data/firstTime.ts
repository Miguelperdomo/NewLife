export type FirstTimeInfoSlug = "expect" | "kids" | "parking";

export interface FirstTimeInfo {
  slug: FirstTimeInfoSlug;
  title: string;
  description: string;
}

// [CONTENIDO TEMPORAL] textos de "Primera vez aquí" del Home — separados
// del componente para poder moverlos a un panel admin después sin tocar FirstTimeSection.tsx
export const firstTimeContent = {
  eyebrow: "Primera vez",
  title: "¿Es tu primera vez en New Life?",
  description:
    "Nos alegra que quieras visitarnos. Aquí tienes todo lo que necesitas saber antes de venir — ven como estés, te esperamos con los brazos abiertos.",
  ctaLabel: "Planifica tu visita",
};

export const firstTimeInfo: FirstTimeInfo[] = [
  {
    slug: "expect",
    title: "Qué esperar",
    description:
      "Un tiempo de alabanza, una palabra práctica y una comunidad que te va a recibir con alegría. Nada de lo que necesitas saber es complicado — solo ven.",
  },
  {
    slug: "kids",
    title: "Niños",
    description:
      "Tenemos un espacio pensado para ellos con New Kids, con actividades y una enseñanza bíblica adaptada a su edad mientras disfrutas el servicio.",
  },
  {
    slug: "parking",
    title: "Parqueadero",
    description:
      "Contamos con zona de parqueo cerca de nuestras sedes. Si tienes dudas de cómo llegar, escríbenos y con gusto te orientamos.",
  },
];
