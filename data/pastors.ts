import type { Pastor } from "@/lib/types";

// [CONTENIDO TEMPORAL] Reemplazar biografías y fotos con la información oficial.
// Para agregar más pastores/líderes, añade un objeto más a este arreglo con el
// `tier` que le corresponda (2 = nivel bajo el pastor principal, 3 = el siguiente, etc.).
export const pastors: Pastor[] = [
  {
    slug: "giovany",
    name: "Pastor Giovany",
    role: "Apóstol · Fundador y Pastor Principal",
    bio: "[CONTENIDO TEMPORAL] Biografía oficial del Pastor Giovany, fundador y cabeza de New Life Church.",
    imageLabel: "[FOTOGRAFÍA PASTOR GIOVANY]",
    tier: 1,
    // [LINKS PLACEHOLDER] Reemplazar con las redes oficiales del pastor.
    social: [
      { platform: "instagram", label: "Instagram", url: "#" },
      { platform: "facebook", label: "Facebook", url: "#" },
    ],
  },
  {
    slug: "lider-2",
    name: "[NOMBRE — PLACEHOLDER]",
    role: "[CARGO — PLACEHOLDER]",
    bio: "[CONTENIDO TEMPORAL]",
    imageLabel: "[FOTOGRAFÍA — PLACEHOLDER]",
    tier: 2,
  },
  {
    slug: "lider-3",
    name: "[NOMBRE — PLACEHOLDER]",
    role: "[CARGO — PLACEHOLDER]",
    bio: "[CONTENIDO TEMPORAL]",
    imageLabel: "[FOTOGRAFÍA — PLACEHOLDER]",
    tier: 2,
  },
];
