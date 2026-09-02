import type { LiveLinks } from "@/lib/types";

/**
 * Enlaces de las transmisiones. Se usa el canal oficial de YouTube (no una
 * transmisión puntual) porque la URL de cada directo cambia cada vez que
 * inicia uno nuevo. Más adelante esto se puede reemplazar por una
 * integración con la YouTube API que detecte el directo activo.
 */
export const liveLinks: LiveLinks = {
  youtube: "https://youtube.com/@reydereyesinternacional9292?si=LgRV9YU1D1gtbZqr",
  // [LINK DE FACEBOOK — PLACEHOLDER] New Life aún no ha dado el enlace oficial.
  facebook: "",
};

export const liveThumbnail = {
  src: "/img/LOGO-TRANSMION.jpg",
  alt: "New Life — Conquista 2026",
};
