import type { LiveLinks } from "@/lib/types";

// enlace al canal de YouTube, no a un directo puntual (la URL de cada live cambia).
// pendiente: integrar la YouTube API para detectar el directo activo solo
export const liveLinks: LiveLinks = {
  youtube: "https://youtube.com/@reydereyesinternacional9292?si=LgRV9YU1D1gtbZqr",
  // [LINK DE FACEBOOK — PLACEHOLDER] New Life aún no ha dado el enlace oficial.
  facebook: "",
};

export const liveThumbnail = {
  src: "/img/LOGO-TRANSMION.jpg",
  alt: "New Life — Conquista 2026",
};
