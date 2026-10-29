import type { Pastor } from "@/lib/types";

// solo el pastor principal, es fijo y no necesita admin ni BD.
// [CONTENIDO TEMPORAL] falta la bio y redes oficiales
export const pastors: Pastor[] = [
  {
    slug: "giovany",
    name: "Apóstol Giovany",
    role: "Apóstol · Fundador y Pastor Principal",
    bio: "[CONTENIDO TEMPORAL] Biografía oficial del Apóstol Giovany, fundador y cabeza de New Life Church.",
    imageLabel: "[FOTOGRAFÍA PASTOR GIOVANY]",
    tier: 1,
    // [LINKS PLACEHOLDER] Reemplazar con las redes oficiales del pastor.
    social: [
      { platform: "instagram", label: "Instagram", url: "#" },
      { platform: "facebook", label: "Facebook", url: "#" },
    ],
  },
];
