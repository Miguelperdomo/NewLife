export interface NavLink {
  label: string;
  href: string;
}

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "whatsapp";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  url: string;
}

export interface Ministry {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  audience: string;
  schedule: string;
  location: string;
  leader: string;
  imageLabel: string;
  /** Ruta local de la foto/logo real, si ya se subió (ver /public/img). */
  imageSrc?: string;
  social?: SocialLink[];
}

/** Una foto de la galería de instalaciones de una sede (ver Campus.gallery). */
export interface CampusGalleryImage {
  label: string;
  /** Ruta local de la foto real, si ya se subió. Sin `src`, se muestra un placeholder de marca. */
  src?: string;
}

export interface Campus {
  slug: string;
  name: string;
  fullName: string;
  address: string;
  /** Texto usado para buscar la ubicación en Google Maps (dirección o plus code). */
  mapQuery: string;
  imageLabel: string;
  /** Ruta local de la foto real, si ya se subió (ver /public/sedes). */
  imageSrc?: string;
  isMain?: boolean;
  /** Slug de data/pastors.ts — pastor/líder responsable de esta sede. */
  leadPastorSlug?: string;
  /** Fotos de las instalaciones, además de la portada. */
  gallery?: CampusGalleryImage[];
  /** Si se define, se usa en vez del WhatsApp general de New Life para esta sede. */
  whatsappNumber?: string;
}

export interface LiveLinks {
  youtube: string;
  facebook: string;
}

export interface Pastor {
  slug: string;
  name: string;
  role: string;
  bio: string;
  imageLabel: string;
  /** Ruta local de la foto real, si ya se subió (ver /public/img). */
  imageSrc?: string;
  /** Nivel dentro de la pirámide de liderazgo: 1 = cabeza/fundador, 2 = siguiente nivel, así sucesivamente. */
  tier: number;
  social?: SocialLink[];
}

/**
 * Un evento es hoy el único tipo de "contenido publicable" del sitio, pero se
 * modela pensando en que no será el único: además de `slug`/`name`, solo lo
 * verdaderamente esencial para un evento es obligatorio (fecha, descripciones,
 * imagen); todo lo demás es opcional y los componentes lo muestran SOLO si
 * viene presente (nunca un `if (category === "...")` — ver EventCard/
 * EventTemplate). Un futuro tipo de contenido (noticia, anuncio, campaña...)
 * seguiría el mismo patrón: su propio tipo + su propio archivo en /data +
 * accesores en lib/content.ts, sin tocar los tipos existentes.
 */
export interface ChurchEvent {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  imageLabel: string;
  /** Ruta local de la foto real, si ya se subió (ver /public/img). */
  imageSrc?: string;
  /** Fecha de inicio, formato "YYYY-MM-DD". */
  date: string;
  /** Fecha de finalización (eventos de varios días). Si no se da, el evento dura solo `date`. */
  endDate?: string;
  time?: string;
  /** Etiqueta libre: "Reunión", "Retiro", "Servicio especial"... */
  category?: string;
  /**
   * Slug de data/ministries.ts, o "general" si no pertenece a un ministerio
   * específico (relación siempre opcional: un evento no necesita ministerio).
   */
  ministry?: string;
  /** Slug de data/campuses.ts. */
  campus?: string;
  /** Lugar específico dentro de la sede, ej. "Salón juvenil". */
  location?: string;
  /** false = no mostrar botón de inscripción (por defecto true). */
  registrationByWhatsApp?: boolean;
}

/**
 * Segundo tipo de contenido, independiente de ChurchEvent (mismo patrón de
 * datos, forma propia). No asume qué publicará New Life — solo lo esencial
 * de cualquier publicación (título, resumen, contenido, fecha, imagen) es
 * obligatorio; autor, categoría y destacada son opcionales de verdad.
 */
export interface NewsArticle {
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageLabel: string;
  /** Ruta local de la foto real, si ya se subió (ver /public/img). */
  imageSrc?: string;
  /** Formato "YYYY-MM-DD". */
  publishedAt: string;
  author?: string;
  /** Etiqueta libre: "Anuncio", "Misiones", "Reflexión"... */
  category?: string;
  featured?: boolean;
  /** "draft" = no aparece en getNews(); por defecto "published". Pensado para un futuro panel. */
  status?: "published" | "draft";
}

/**
 * Tercer tipo de contenido: un versículo bíblico para la tarjeta "Un momento
 * para ti" del Home. Mismo patrón — dato en /data, accesor en lib/content.ts,
 * listo para que un futuro panel administre/agregue versículos sin tocar
 * el componente que los muestra.
 */
export interface Verse {
  slug: string;
  text: string;
  /** "Salmos 23:1". */
  reference: string;
  /** Traducción usada, para mantenerla consistente en todo el sitio. */
  translation: string;
  /** Tema libre: "Esperanza", "Fe", "Paz"... */
  theme?: string;
}
