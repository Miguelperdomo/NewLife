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
  /** Ruta local de la foto/logo real, si ya se subió (ver /public/img). Se usa en la tarjeta de /ministerios. */
  imageSrc?: string;
  /** Foto grande de la cabecera en /ministerios/[slug]. Si no se define, se cae a `imageSrc`. */
  headerImageSrc?: string;
  social?: SocialLink[];
  /** WhatsApp propio de este ministerio — si se define, se usa en vez del WhatsApp general de la iglesia. */
  whatsapp?: string;
  /** Link externo de inscripción (ej. Google Forms) — si se define, el botón de inscripción lleva ahí en vez de abrir WhatsApp. */
  registrationUrl?: string;
}

/** Una foto de la galería de instalaciones de una sede (ver Campus.gallery). */
export interface CampusGalleryImage {
  label: string;
  /** Ruta local de la foto real, si ya se subió. Sin `src`, se muestra un placeholder de marca. */
  src?: string;
}

/** Un horario recurrente de servicio (ej. "Domingo 9:00 a.m. — Culto principal"). */
export interface ServiceSchedule {
  /** 0 = domingo, igual que Date.getDay(). */
  dayOfWeek: number;
  /** "HH:MM" en 24 horas. */
  time: string;
  title: string;
  description?: string;
  /** Si este horario es de un ministerio en particular (ej. "Reunión Juvenil" -> New Gen), enlaza a su página. */
  ministrySlug?: string;
}

export interface Campus {
  slug: string;
  name: string;
  fullName: string;
  address: string;
  /** Ciudad de esta sede — para agrupar/filtrar sedes por ciudad en el mapa conjunto de /sedes. */
  city?: string;
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
  schedules?: ServiceSchedule[];
  /** Comodidades de esta sede — se muestran como íconos en su página pública. */
  hasParking?: boolean;
  isWheelchairAccessible?: boolean;
  hasChildcare?: boolean;
}

export interface LiveLinks {
  youtube: string;
  facebook: string;
}

/** Una tarjeta de la sección "¿Es tu primera vez?" del Home. */
export interface FirstTimeCard {
  /** Clave de lib/firstTimeIcons.ts. */
  icon: string;
  title: string;
  description: string;
}

/** Una opción del widget flotante de Ayuda y donaciones. */
export interface HelpOption {
  /** Clave de lib/helpOptionIcons.ts. */
  icon: string;
  title: string;
  description: string;
}

export interface HeroPhoto {
  src: string;
  alt?: string;
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
  /** Si se define, se usa en vez del WhatsApp general de New Life para contactar al pastor. */
  whatsappNumber?: string;
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
  /** Marcado como "Destacado" en el panel admin — lo usa, por ejemplo, la cuenta regresiva del Home. */
  featured?: boolean;
  /** Distinto de `featured`: controla solo si aparece como anuncio grande en el Hero del Inicio. */
  highlightHome?: boolean;
  /** Link externo de inscripción (ej. Google Forms) — si se define, el botón de inscripción lleva ahí en vez de abrir WhatsApp. */
  registrationUrl?: string;
  /** WhatsApp propio de este evento — si se define, el botón de inscripción lo usa en vez del WhatsApp general de la iglesia. */
  whatsappNumber?: string;
  /** Cuándo se publicó (no confundir con `date`, que es cuándo ocurre el evento) — para la insignia "Nuevo". */
  createdAt?: string;
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
