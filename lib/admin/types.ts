export type ContentStatus = "draft" | "published" | "scheduled" | "archived";

// Secciones del panel que se le pueden dar por separado a un admin (ver
// users.ts). "full" es el comodín, da acceso a todo. "content" cubre
// Eventos y Noticias juntos porque comparten módulo (/admin/contenido).
export const ADMIN_SECTIONS = ["full", "ministries", "campuses", "content", "settings", "prayer", "baptism", "visits"] as const;
export type AdminSection = (typeof ADMIN_SECTIONS)[number];

// "content" sigue llamándose así por dentro (Eventos + Noticias), pero
// mientras Noticias esté en pausa se muestra solo como "Eventos" para no
// confundir al crear un usuario. Si se reactiva, basta con cambiar la etiqueta.
export const ADMIN_SECTION_LABELS: Record<AdminSection, string> = {
  full: "Todo",
  ministries: "Ministerios",
  campuses: "Sedes",
  content: "Eventos",
  settings: "Configuración",
  prayer: "Oración",
  baptism: "Bautismo",
  visits: "Primera visita",
};

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  sections: AdminSection[];
  /** null = acceso indefinido. Pasada la fecha, la sesión queda "sin permisos" sin borrar sections (ver auth.ts). */
  accessUntil: string | null;
  /** null si nunca ha entrado. Viene de auth.admin.listUsers(), no de la tabla admins. */
  lastSignInAt: string | null;
  createdAt: string;
}

/** Pedido de oración del sitio público — solo lo ve quien tenga el permiso "prayer". */
export interface AdminPrayerRequest {
  id: number;
  /** null = lo dejó anónimo. */
  name: string | null;
  message: string;
  /** WhatsApp o correo, opcional. */
  contact: string | null;
  status: "nueva" | "atendida";
  createdAt: string;
}

/** "Quiero bautizarme" del sitio público — solo lo ve quien tenga el permiso "baptism". */
export interface AdminBaptismRequest {
  id: number;
  name: string;
  phone: string;
  status: "nueva" | "atendida";
  createdAt: string;
}

/** "Avísanos que vienes" del Home — solo lo ve quien tenga el permiso "visits". */
export interface AdminVisitCheckin {
  id: number;
  name: string;
  /** Opcional solo por avisos viejos, el formulario público ya lo exige. */
  phone?: string;
  peopleCount: number;
  /** Texto libre, no FK — así un cambio de nombre de sede no rompe check-ins viejos. */
  campus: string;
  /** "YYYY-MM-DD", el día que dijo que vendría. */
  visitDate: string;
  /** Visita de un pastor, se gestiona aparte de una normal. */
  isPastor: boolean;
  status: "nueva" | "atendida";
  createdAt: string;
}

export interface AdminActivityLogEntry {
  id: number;
  adminName: string;
  summary: string;
  createdAt: string;
  /** Lo que se guardó en esa acción, se muestra al hacer clic en el registro. */
  details?: Record<string, string>;
}

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
  /** No es lo mismo que `featured`: este controla si sale como anuncio grande en el Hero del Inicio. */
  highlightHome?: boolean;
}

export interface AdminNews extends AdminContentBase {
  summary?: string;
  content: string;
  /** "YYYY-MM-DD". */
  publishedAt: string;
  author?: string;
  category?: string;
}

/** Horario recurrente de servicio (ej. "Domingo 9:00 a.m. — Culto principal"). */
export interface AdminServiceSchedule {
  /** 0 = domingo, como Date.getDay(). */
  dayOfWeek: number;
  /** "HH:MM" 24h, lo que da <input type="time">. */
  time: string;
  title: string;
  description?: string;
  /** Si es de un ministerio en particular, enlaza a su página pública. */
  ministrySlug?: string;
}

export interface AdminCampus {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  address: string;
  /** Separada de `address` para poder agrupar/filtrar sedes por ciudad (mapa de /sedes). */
  city?: string;
  /** Texto para buscar la ubicación en Google Maps (dirección o plus code). */
  mapQuery: string;
  imageSrc?: string;
  isMain?: boolean;
  /** Slug de data/pastors.ts. */
  leadPastorSlug?: string;
  /** Si se define, reemplaza el WhatsApp general de New Life para esta sede. */
  whatsappNumber?: string;
  schedules: AdminServiceSchedule[];
  /** Se muestran como íconos en la página pública de la sede. */
  hasParking?: boolean;
  isWheelchairAccessible?: boolean;
  hasChildcare?: boolean;
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
  /** Foto de la tarjeta en /ministerios. */
  imageSrc?: string;
  /** Foto grande de la cabecera en /ministerios/[slug]. Sin definir, cae a imageSrc. */
  headerImageSrc?: string;
  // texto libre por ahora — data/pastors.ts modela la cabeza de liderazgo de
  // la iglesia, no a los responsables de cada ministerio, son personas
  // distintas. Si algún día hay un directorio de personas, este campo
  // debería volverse leaderPersonId (FK)
  leader?: string;
  /** WhatsApp propio del ministerio, si no está se usa el general de New Life. */
  whatsapp?: string;
  /** Link externo de inscripción (Google Forms, etc), si está el botón lleva ahí en vez de abrir WhatsApp. */
  registrationUrl?: string;
  /** Se guarda en la columna `social` (jsonb) como plataforma "instagram" — ver ministries.ts. */
  instagramUrl?: string;
  meetingSchedule?: string;
  meetingLocation?: string;
  status: MinistryStatus;
  /** Orden en /ministerios, menor = primero. */
  displayOrder: number;
  /** Independiente de `status`, para ocultar un ministerio activo sin archivarlo. */
  showPublicly: boolean;
  createdAt: string;
  updatedAt: string;
}

// Ajustes generales del sitio, un único registro, no una lista como
// Eventos/Noticias/Sedes/Ministerios.
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

  // título grande de la portada; el texto de abajo reutiliza "description" de arriba
  heroTagline?: string;
  // si se define, la portada muestra "X años sirviendo" junto al conteo de sedes/ministerios
  foundingYear?: number;

  // hex "#rrggbb", sí cambian el sitio público (ver lib/color.ts + app/layout.tsx)
  primaryColor: string;
  accentColor: string;
  coverImageUrl?: string;

  // URL + interruptor independiente por red
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

  // qué secciones se muestran en el Home
  showMinistries: boolean;
  showLive: boolean;
  /** Interruptor manual "estamos transmitiendo ahora", se combina con la detección automática de YouTube (lib/youtubeLive.ts) — cualquiera en true activa el modo "en vivo" del Hero. */
  isLiveManual: boolean;
  showEvents: boolean;
  showNews: boolean;
  showAgenda: boolean;
  showCampuses: boolean;
  showHelp: boolean;

  // mensaje predeterminado en los enlaces de WhatsApp del sitio; teléfono/correo son un canal secundario
  whatsappDefaultMessage: string;
  supportPhone?: string;
  contactEmail?: string;

  // título/descripción/imagen al compartir el link en WhatsApp/redes; vacíos = usa el logo/nombre de siempre
  seoTitle?: string;
  seoDescription?: string;
  seoImageUrl?: string;

  // página "Conócenos", reemplaza el texto de ejemplo de app/(site)/nosotros
  aboutImageUrl?: string;
  aboutQuienesSomos?: string;
  aboutMision?: string;
  aboutVision?: string;
  aboutValores?: string;

  // las 6 opciones del widget de Ayuda viven en su propia tabla (helpOptions.ts), esto es solo el encabezado
  helpTitle?: string;
  helpDescription?: string;
  helpCtaLabel?: string;
  helpOptionsTitle?: string;

  // las tarjetas de "¿Es tu primera vez?" viven en firstTimeCards.ts, esto es el encabezado
  firstTimeEyebrow?: string;
  firstTimeTitle?: string;
  firstTimeDescription?: string;
  firstTimeCtaLabel?: string;

  // se reutilizan igual en el resumen del Home y en la página completa (/ministerios, /sedes...)
  ministriesEyebrow?: string;
  ministriesTitle?: string;
  ministriesDescription?: string;
  campusesEyebrow?: string;
  campusesTitle?: string;
  campusesDescription?: string;
  eventsEyebrow?: string;
  eventsTitle?: string;
  eventsDescription?: string;
  newsEyebrow?: string;
  newsTitle?: string;
  newsDescription?: string;
  // Pastores no tiene resumen en el Home, solo /pastores
  pastorsEyebrow?: string;
  pastorsTitle?: string;
  pastorsDescription?: string;

  // bloque "En vivo" del Home
  liveThumbnailUrl?: string;
  liveThumbnailAlt?: string;

  // /privacidad y /terminos
  privacyPolicy?: string;
  termsOfService?: string;

  // se muestran en el widget de Ayuda al elegir "Donación económica";
  // donationsEnabled por defecto en false hasta tener datos de cuenta reales
  donationsEnabled: boolean;
  donationTitle?: string;
  donationTeaser?: string;
  donationDescription?: string;
  bankName?: string;
  bankAccountType?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  nequiNumber?: string;
  daviplataNumber?: string;

  // si está activo, el sitio público muestra un aviso en vez del contenido normal; el admin sigue funcionando
  maintenanceMode: boolean;

  updatedAt: string;
}

export type AdminContentType = "event" | "news";

/** Forma aplanada que usan las listas del dashboard (tabla completa, resumen reciente...). */
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

/** Tarjeta de "¿Es tu primera vez?" del Home — lista libre, se reemplaza completa al guardar. */
export interface AdminFirstTimeCard {
  /** Clave de firstTimeIcons.ts. */
  icon: string;
  title: string;
  description: string;
}

/** Opción del widget de Ayuda y donaciones — lista libre, se reemplaza completa al guardar. */
export interface AdminHelpOption {
  /** Clave de helpOptionIcons.ts. */
  icon: string;
  title: string;
  description: string;
}

/** Foto del carrusel del Hero — lista libre, se reemplaza completa al guardar. */
export interface AdminHeroPhoto {
  imageUrl: string;
  alt?: string;
}

// Perfil del pastor principal, singleton como AdminSiteSettings. New Life
// solo tiene un pastor, así que no es una lista con crear/editar/archivar,
// solo un formulario que se guarda encima.
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
