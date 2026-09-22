import type { Pastor } from "@/lib/types";

// Solo el pastor principal de New Life — sin módulo admin ni base de datos
// para esto a propósito: es una única persona fija, no una lista que vaya a
// crecer. [CONTENIDO TEMPORAL] Reemplazar biografía, foto y redes por la
// información oficial cuando la tengamos.
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
