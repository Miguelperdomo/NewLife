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
  /** foto de la tarjeta en /ministerios, si ya se subió */
  imageSrc?: string;
  /** foto grande de /ministerios/[slug]; sin esta, cae a imageSrc */
  headerImageSrc?: string;
  social?: SocialLink[];
  /** si existe, se usa en vez del WhatsApp general */
  whatsapp?: string;
  /** link externo (Google Forms...) en vez de abrir WhatsApp */
  registrationUrl?: string;
}

export interface CampusGalleryImage {
  label: string;
  /** sin src, se muestra un placeholder de marca */
  src?: string;
}

/** horario recurrente, ej. "Domingo 9:00 a.m. — Culto principal" */
export interface ServiceSchedule {
  /** 0 = domingo */
  dayOfWeek: number;
  /** "HH:MM" en 24h */
  time: string;
  title: string;
  description?: string;
  /** si es de un ministerio en particular, enlaza a su página */
  ministrySlug?: string;
}

export interface Campus {
  slug: string;
  name: string;
  fullName: string;
  address: string;
  /** para agrupar/filtrar sedes por ciudad en /sedes */
  city?: string;
  /** dirección o plus code para buscar en Google Maps */
  mapQuery: string;
  imageLabel: string;
  imageSrc?: string;
  isMain?: boolean;
  /** slug de data/pastors.ts */
  leadPastorSlug?: string;
  gallery?: CampusGalleryImage[];
  /** si existe, reemplaza el WhatsApp general para esta sede */
  whatsappNumber?: string;
  schedules?: ServiceSchedule[];
  hasParking?: boolean;
  isWheelchairAccessible?: boolean;
  hasChildcare?: boolean;
}

export interface LiveLinks {
  youtube: string;
  facebook: string;
}

export interface FirstTimeCard {
  /** clave de lib/firstTimeIcons.ts */
  icon: string;
  title: string;
  description: string;
}

export interface HelpOption {
  /** clave de lib/helpOptionIcons.ts */
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
  imageSrc?: string;
  /** 1 = cabeza/fundador, 2 = siguiente nivel, etc. */
  tier: number;
  social?: SocialLink[];
  whatsappNumber?: string;
}

// Por ahora el único "contenido publicable" es Evento, pero está pensado
// para no ser el único: solo lo esencial (fecha, descripciones, imagen) es
// obligatorio, el resto es opcional y los componentes lo muestran solo si
// viene (nada de `if (category === "...")`, ver EventCard/EventTemplate).
// Un tipo nuevo seguiría el mismo patrón: su interfaz + su archivo en /data
// + accesores en lib/content.ts, sin tocar lo que ya existe.
export interface ChurchEvent {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  imageLabel: string;
  imageSrc?: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** solo en eventos de varios días; sin esto dura solo `date` */
  endDate?: string;
  time?: string;
  /** texto libre: "Reunión", "Retiro", "Servicio especial"... */
  category?: string;
  /** slug de data/ministries.ts, o "general" */
  ministry?: string;
  campus?: string;
  /** lugar dentro de la sede, ej. "Salón juvenil" */
  location?: string;
  /** false = oculta el botón de inscripción (default true) */
  registrationByWhatsApp?: boolean;
  /** "Destacado" en el admin — la cuenta regresiva del Home lo usa */
  featured?: boolean;
  /** distinto de featured: solo controla el anuncio grande del Hero */
  highlightHome?: boolean;
  registrationUrl?: string;
  whatsappNumber?: string;
  /** cuándo se publicó (no `date`, que es cuándo ocurre) — para la insignia "Nuevo" */
  createdAt?: string;
}

// Segundo tipo de contenido, mismo patrón que ChurchEvent. Solo lo esencial
// (título, resumen, contenido, fecha, imagen) es obligatorio.
export interface NewsArticle {
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageLabel: string;
  imageSrc?: string;
  /** "YYYY-MM-DD" */
  publishedAt: string;
  author?: string;
  /** texto libre: "Anuncio", "Misiones", "Reflexión"... */
  category?: string;
  featured?: boolean;
  /** "draft" no aparece en getNews(); default "published" */
  status?: "published" | "draft";
}

// Versículo bíblico para la tarjeta "Un momento para ti" del Home.
export interface Verse {
  slug: string;
  text: string;
  /** "Salmos 23:1" */
  reference: string;
  translation: string;
  /** texto libre: "Esperanza", "Fe", "Paz"... */
  theme?: string;
}
