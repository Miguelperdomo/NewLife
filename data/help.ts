export type HelpOptionSlug = "donacion" | "ropa" | "alimentos" | "articulos" | "tiempo" | "talento";

export interface HelpOption {
  slug: HelpOptionSlug;
  title: string;
  description: string;
}

// [CONTENIDO TEMPORAL] Textos y opciones del widget flotante de ayuda. Se
// mantienen separados del componente para que, cuando exista una sección
// "Ayuda y donaciones" en /admin, solo haya que reemplazar este archivo por
// datos del panel — ver components/sections/HelpWidget.tsx, que no cambiaría.
export const helpWidgetContent = {
  title: "Sé parte de algo más grande",
  description: "Hay muchas formas de bendecir y ayudar a nuestra comunidad.",
  ctaLabel: "Quiero ayudar",
  optionsTitle: "¿Cómo quieres ayudar?",
};

export const helpOptions: HelpOption[] = [
  {
    slug: "donacion",
    title: "Donación económica",
    description: "Apoya proyectos y necesidades de nuestra comunidad.",
  },
  {
    slug: "ropa",
    title: "Ropa",
    description: "Puedes aportar ropa limpia y en buen estado.",
  },
  {
    slug: "alimentos",
    title: "Alimentos",
    description: "Apoya con alimentos no perecederos.",
  },
  {
    slug: "articulos",
    title: "Artículos y donaciones en especie",
    description: "Juguetes, útiles y otros elementos que puedan ser de ayuda.",
  },
  {
    slug: "tiempo",
    title: "Tu tiempo",
    description: "Únete y sirve como voluntario.",
  },
  {
    slug: "talento",
    title: "Tu talento",
    description: "También puedes aportar tus conocimientos, habilidades o servicios.",
  },
];
