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
  shortDescription: string;
  description: string;
  /** Etiqueta libre: "Reunión", "Retiro", "Servicio especial"... */
  category?: string;
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

/** Un horario recurrente de servicio (ej. "Domingo 9:00 a.m. — Culto principal"). */
export interface AdminServiceSchedule {
  /** 0 = domingo, igual que Date.getDay(). */
  dayOfWeek: number;
  /** "HH:MM" en 24 horas (lo que da <input type="time">). */
  time: string;
  title: string;
  description?: string;
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
  schedules: AdminServiceSchedule[];
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

  // Portada (Hero) del Home — el título grande. El texto debajo reutiliza
  // "description" de arriba, para no duplicar el mismo dato dos veces.
  heroTagline?: string;

  // Apariencia — hex "#rrggbb". Sí cambian el sitio público: ver
  // lib/color.ts + app/layout.tsx, que generan las variables CSS a partir
  // de estos dos colores.
  primaryColor: string;
  accentColor: string;
  coverImageUrl?: string;

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

  // SEO / vista previa al compartir — título, descripción e imagen que
  // aparecen cuando alguien comparte el link del sitio en WhatsApp/redes.
  // Si quedan vacíos, el sitio usa el nombre/descripción/logo de siempre.
  seoTitle?: string;
  seoDescription?: string;
  seoImageUrl?: string;

  // Página "Conócenos" — reemplaza el texto de ejemplo de app/(site)/nosotros.
  aboutImageUrl?: string;
  aboutQuienesSomos?: string;
  aboutMision?: string;
  aboutVision?: string;
  aboutValores?: string;

  // Widget flotante de Ayuda y donaciones — las 6 opciones (con íconos) viven
  // en su propia tabla (ver lib/admin/helpOptions.ts), esto es solo el texto
  // fijo de encabezado del widget.
  helpTitle?: string;
  helpDescription?: string;
  helpCtaLabel?: string;
  helpOptionsTitle?: string;

  // Donaciones — se muestran en el widget de Ayuda cuando alguien elige
  // "Donación económica". `donationsEnabled` controla si se muestran ahí (por
  // defecto no, hasta que la iglesia confirme datos reales de cuenta).
  donationsEnabled: boolean;
  bankName?: string;
  bankAccountType?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  nequiNumber?: string;
  daviplataNumber?: string;

  // Si está activo, el sitio público muestra un aviso de mantenimiento en
  // vez del contenido normal — el panel admin sigue funcionando siempre,
  // para poder volver a apagarlo.
  maintenanceMode: boolean;

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

/** Una tarjeta de la sección "¿Es tu primera vez?" del Home — lista libre, se reemplaza completa al guardar. */
export interface AdminFirstTimeCard {
  /** Clave de lib/firstTimeIcons.ts. */
  icon: string;
  title: string;
  description: string;
}

/** Una opción del widget de Ayuda y donaciones — lista libre, se reemplaza completa al guardar. */
export interface AdminHelpOption {
  /** Clave de lib/helpOptionIcons.ts. */
  icon: string;
  title: string;
  description: string;
}

/**
 * Perfil del pastor principal — singleton (una sola fila), como
 * AdminSiteSettings. New Life solo tiene un pastor a propósito (ver
 * data/pastors.ts original), así que no es una lista con crear/editar/
 * archivar como Ministerios/Sedes, solo un formulario que se guarda encima.
 */
export interface AdminPastorProfile {
  name: string;
  role?: string;
  bio?: string;
  imageSrc?: string;
  whatsappNumber?: string;
  facebookUrl?: string;
  facebookEnabled: boolean;
  instagramUrl?: string;
  instagramEnabled: boolean;
  updatedAt: string;
}
