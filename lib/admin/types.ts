export type ContentStatus = "draft" | "published" | "scheduled" | "archived";

export type MinistryAudience =
  | { mode: "all" }
  | { mode: "specific"; ministrySlugs: string[] }
  | { mode: "general" };

interface AdminContentBase {
  id: string;
  slug: string;
  title: string;
  imageSrc?: string;
  status: ContentStatus;
  /** Solo relevante cuando status === "scheduled". */
  publishAt?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminEvent extends AdminContentBase {
  description: string;
  /** "YYYY-MM-DD". */
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  /** Slug de data/campuses.ts. */
  campus?: string;
  location?: string;
  audience: MinistryAudience;
  registrationUrl?: string;
  whatsappNumber?: string;
  capacity?: number;
}

export interface AdminNews extends AdminContentBase {
  summary?: string;
  content: string;
  /** "YYYY-MM-DD". */
  publishedAt: string;
  author?: string;
  category?: string;
}

export interface AdminCampus {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  address: string;
  /** Texto usado para buscar la ubicación en Google Maps (dirección o plus code). */
  mapQuery: string;
  imageSrc?: string;
  isMain?: boolean;
  /** Slug de data/pastors.ts. */
  leadPastorSlug?: string;
  /** Si se define, se usa en vez del WhatsApp general de New Life para esta sede. */
  whatsappNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export type MinistryStatus = "active" | "archived";

export interface AdminMinistry {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  imageSrc?: string;
  /**
   * Texto libre por ahora. data/pastors.ts modela la cabeza de liderazgo de
   * la iglesia (pastores/tiers), no a los responsables de cada ministerio —
   * son personas distintas, así que forzar una relación ahí sería la
   * "relación innecesaria" de la que hay que cuidarse. Si en el futuro existe
   * un directorio real de personas (`people`), este campo es el candidato
   * natural a convertirse en `leaderPersonId` (FK).
   */
  leader?: string;
  /** Número de WhatsApp propio del ministerio; si no se define, la capa pública usa el general de New Life. */
  whatsapp?: string;
  meetingSchedule?: string;
  meetingLocation?: string;
  status: MinistryStatus;
  /** Orden de aparición en /ministerios (menor = primero). */
  displayOrder: number;
  /** Independiente de `status`: permite ocultar un ministerio activo sin archivarlo. */
  showPublicly: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Ajustes generales del sitio — un único registro (singleton), no una lista
 * como Eventos/Noticias/Sedes/Ministerios. Pensado desde ya para que, cuando
 * exista backend multi-tenant, esta forma se vuelva una fila de una tabla
 * `churches`/`tenants` en vez de tener que rediseñarla.
 */
export interface AdminSiteSettings {
  // Información general
  churchName: string;
  description?: string;
  logoUrl?: string;
  faviconUrl?: string;
  phone?: string;
  whatsappNumber: string;
  email?: string;
  address?: string;
  city?: string;
  generalSchedule?: string;

  // Apariencia — hex "#rrggbb". No cambian el sitio público todavía (ver
  // lib/admin/siteSettings.ts), solo se guardan preparados para cuando sí.
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  coverImageUrl?: string;
  footerText?: string;

  // Redes sociales — URL + interruptor independiente por red.
  facebookUrl?: string;
  facebookEnabled: boolean;
  instagramUrl?: string;
  instagramEnabled: boolean;
  youtubeUrl?: string;
  youtubeEnabled: boolean;
  tiktokUrl?: string;
  tiktokEnabled: boolean;
  whatsappSocialUrl?: string;
  whatsappSocialEnabled: boolean;

  // Qué secciones se muestran en el Home.
  showMinistries: boolean;
  showLive: boolean;
  showEvents: boolean;
  showNews: boolean;
  showAgenda: boolean;
  showCampuses: boolean;
  showHelp: boolean;

  // Contacto y WhatsApp — distinto de "WhatsApp principal" de arriba: este
  // mensaje es el que se usaría como texto predeterminado en los enlaces de
  // WhatsApp del sitio; teléfono/correo aquí son un canal secundario opcional.
  whatsappDefaultMessage: string;
  supportPhone?: string;
  contactEmail?: string;

  updatedAt: string;
}

export type AdminContentType = "event" | "news";

/** Forma "aplanada" común usada por las listas del dashboard (tabla completa, resumen reciente...). */
export interface ContentRow {
  id: string;
  type: AdminContentType;
  title: string;
  imageSrc?: string;
  status: ContentStatus;
  date: string;
  updatedAt: string;
  ministryLabel?: string;
  featured?: boolean;
}
