import type {
  CampusFormValues,
  EventFormValues,
  MinistryFormValues,
  NewsFormValues,
  SiteSettingsFormValues,
} from "@/lib/admin/schemas";
import type {
  AdminCampus,
  AdminEvent,
  AdminMinistry,
  AdminNews,
  AdminSiteSettings,
} from "@/lib/admin/types";

type NewEventInput = Omit<AdminEvent, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };
type NewNewsInput = Omit<AdminNews, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };
type NewCampusInput = Omit<AdminCampus, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };
// A diferencia de los otros: el slug SÍ viene del formulario (es editable a
// mano), así que aquí no se omite — solo id/createdAt/updatedAt los pone el hook.
type NewMinistryInput = Omit<AdminMinistry, "id" | "createdAt" | "updatedAt">;
// Singleton: sin id/slug — solo updatedAt lo pone el hook al guardar.
type SiteSettingsInput = Omit<AdminSiteSettings, "updatedAt">;

function orUndefined(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Convierte los valores del formulario (todos strings) a la forma que guarda el store. */
export function eventFormValuesToInput(values: EventFormValues): NewEventInput {
  return {
    title: values.title,
    shortDescription: values.shortDescription,
    description: values.description,
    category: orUndefined(values.category),
    imageSrc: orUndefined(values.imageSrc),
    status: values.status,
    publishAt: orUndefined(values.publishAt),
    startDate: values.startDate,
    endDate: orUndefined(values.endDate),
    startTime: orUndefined(values.startTime),
    endTime: orUndefined(values.endTime),
    campus: orUndefined(values.campus),
    location: orUndefined(values.location),
    audience: values.audience,
    registrationUrl: orUndefined(values.registrationUrl),
    whatsappNumber: orUndefined(values.whatsappNumber),
    capacity: values.capacity ? Number(values.capacity) : undefined,
    featured: values.featured,
  };
}

/** Inverso de eventFormValuesToInput: precarga el formulario al editar un evento existente. */
export function eventToFormValues(event: AdminEvent): EventFormValues {
  return {
    title: event.title,
    shortDescription: event.shortDescription,
    description: event.description,
    category: event.category ?? "",
    imageSrc: event.imageSrc ?? "",
    status: event.status,
    publishAt: event.publishAt ?? "",
    startDate: event.startDate,
    endDate: event.endDate ?? "",
    startTime: event.startTime ?? "",
    endTime: event.endTime ?? "",
    campus: event.campus ?? "",
    location: event.location ?? "",
    audience: event.audience,
    registrationUrl: event.registrationUrl ?? "",
    whatsappNumber: event.whatsappNumber ?? "",
    capacity: event.capacity ? String(event.capacity) : "",
    featured: event.featured,
  };
}

export function newsToFormValues(article: AdminNews): NewsFormValues {
  return {
    title: article.title,
    summary: article.summary ?? "",
    content: article.content,
    imageSrc: article.imageSrc ?? "",
    status: article.status,
    publishAt: article.publishAt ?? "",
    publishedAt: article.publishedAt,
    author: article.author ?? "",
    category: article.category ?? "",
    featured: article.featured,
  };
}

export function newsFormValuesToInput(values: NewsFormValues): NewNewsInput {
  return {
    title: values.title,
    summary: orUndefined(values.summary),
    content: values.content,
    imageSrc: orUndefined(values.imageSrc),
    status: values.status,
    publishAt: orUndefined(values.publishAt),
    publishedAt: values.publishedAt,
    author: orUndefined(values.author),
    category: orUndefined(values.category),
    featured: values.featured,
  };
}

export function campusFormValuesToInput(values: CampusFormValues): NewCampusInput {
  return {
    name: values.name,
    fullName: values.fullName,
    address: values.address,
    mapQuery: values.mapQuery,
    imageSrc: orUndefined(values.imageSrc),
    isMain: values.isMain,
    leadPastorSlug: orUndefined(values.leadPastorSlug),
    whatsappNumber: orUndefined(values.whatsappNumber),
    schedules: values.schedules.map((schedule) => ({
      dayOfWeek: Number(schedule.dayOfWeek),
      time: schedule.time,
      title: schedule.title,
      description: orUndefined(schedule.description),
    })),
  };
}

/** Inverso de campusFormValuesToInput: precarga el formulario al editar una sede existente. */
export function campusToFormValues(campus: AdminCampus): CampusFormValues {
  return {
    name: campus.name,
    fullName: campus.fullName,
    address: campus.address,
    mapQuery: campus.mapQuery,
    imageSrc: campus.imageSrc ?? "",
    isMain: campus.isMain,
    leadPastorSlug: campus.leadPastorSlug ?? "",
    whatsappNumber: campus.whatsappNumber ?? "",
    schedules: campus.schedules.map((schedule) => ({
      dayOfWeek: String(schedule.dayOfWeek),
      time: schedule.time,
      title: schedule.title,
      description: schedule.description ?? "",
    })),
  };
}

export function ministryFormValuesToInput(values: MinistryFormValues): NewMinistryInput {
  return {
    name: values.name,
    slug: values.slug,
    shortDescription: values.shortDescription,
    description: values.description,
    imageSrc: orUndefined(values.imageSrc),
    leader: orUndefined(values.leader),
    whatsapp: orUndefined(values.whatsapp),
    meetingSchedule: orUndefined(values.meetingSchedule),
    meetingLocation: orUndefined(values.meetingLocation),
    status: values.status,
    displayOrder: Number(values.displayOrder),
    showPublicly: values.showPublicly,
  };
}

/** Inverso de ministryFormValuesToInput: precarga el formulario al editar un ministerio existente. */
export function ministryToFormValues(ministry: AdminMinistry): MinistryFormValues {
  return {
    name: ministry.name,
    slug: ministry.slug,
    shortDescription: ministry.shortDescription,
    description: ministry.description,
    imageSrc: ministry.imageSrc ?? "",
    leader: ministry.leader ?? "",
    whatsapp: ministry.whatsapp ?? "",
    meetingSchedule: ministry.meetingSchedule ?? "",
    meetingLocation: ministry.meetingLocation ?? "",
    status: ministry.status,
    displayOrder: String(ministry.displayOrder),
    showPublicly: ministry.showPublicly,
  };
}

export function siteSettingsFormValuesToInput(values: SiteSettingsFormValues): SiteSettingsInput {
  return {
    churchName: values.churchName,
    description: orUndefined(values.description),
    logoUrl: orUndefined(values.logoUrl),
    faviconUrl: orUndefined(values.faviconUrl),
    phone: orUndefined(values.phone),
    whatsappNumber: values.whatsappNumber,
    email: orUndefined(values.email),
    address: orUndefined(values.address),
    city: orUndefined(values.city),
    generalSchedule: orUndefined(values.generalSchedule),

    heroTagline: orUndefined(values.heroTagline),

    primaryColor: values.primaryColor,
    accentColor: values.accentColor,
    coverImageUrl: orUndefined(values.coverImageUrl),

    facebookUrl: orUndefined(values.facebookUrl),
    facebookEnabled: values.facebookEnabled,
    instagramUrl: orUndefined(values.instagramUrl),
    instagramEnabled: values.instagramEnabled,
    youtubeUrl: orUndefined(values.youtubeUrl),
    youtubeEnabled: values.youtubeEnabled,
    tiktokUrl: orUndefined(values.tiktokUrl),
    tiktokEnabled: values.tiktokEnabled,
    whatsappSocialUrl: orUndefined(values.whatsappSocialUrl),
    whatsappSocialEnabled: values.whatsappSocialEnabled,

    showMinistries: values.showMinistries,
    showLive: values.showLive,
    showEvents: values.showEvents,
    showNews: values.showNews,
    showAgenda: values.showAgenda,
    showCampuses: values.showCampuses,
    showHelp: values.showHelp,

    whatsappDefaultMessage: values.whatsappDefaultMessage,
    supportPhone: orUndefined(values.supportPhone),
    contactEmail: orUndefined(values.contactEmail),

    seoTitle: orUndefined(values.seoTitle),
    seoDescription: orUndefined(values.seoDescription),
    seoImageUrl: orUndefined(values.seoImageUrl),

    aboutImageUrl: orUndefined(values.aboutImageUrl),
    aboutQuienesSomos: orUndefined(values.aboutQuienesSomos),
    aboutMision: orUndefined(values.aboutMision),
    aboutVision: orUndefined(values.aboutVision),
    aboutValores: orUndefined(values.aboutValores),

    helpTitle: orUndefined(values.helpTitle),
    helpDescription: orUndefined(values.helpDescription),
    helpCtaLabel: orUndefined(values.helpCtaLabel),
    helpOptionsTitle: orUndefined(values.helpOptionsTitle),

    donationsEnabled: values.donationsEnabled,
    bankName: orUndefined(values.bankName),
    bankAccountType: orUndefined(values.bankAccountType),
    bankAccountNumber: orUndefined(values.bankAccountNumber),
    bankAccountHolder: orUndefined(values.bankAccountHolder),
    nequiNumber: orUndefined(values.nequiNumber),
    daviplataNumber: orUndefined(values.daviplataNumber),

    maintenanceMode: values.maintenanceMode,
  };
}

/** Inverso de siteSettingsFormValuesToInput: precarga el formulario con la configuración guardada. */
export function siteSettingsToFormValues(settings: AdminSiteSettings): SiteSettingsFormValues {
  return {
    churchName: settings.churchName,
    description: settings.description ?? "",
    logoUrl: settings.logoUrl ?? "",
    faviconUrl: settings.faviconUrl ?? "",
    phone: settings.phone ?? "",
    whatsappNumber: settings.whatsappNumber,
    email: settings.email ?? "",
    address: settings.address ?? "",
    city: settings.city ?? "",
    generalSchedule: settings.generalSchedule ?? "",

    heroTagline: settings.heroTagline ?? "",

    primaryColor: settings.primaryColor,
    accentColor: settings.accentColor,
    coverImageUrl: settings.coverImageUrl ?? "",

    facebookUrl: settings.facebookUrl ?? "",
    facebookEnabled: settings.facebookEnabled,
    instagramUrl: settings.instagramUrl ?? "",
    instagramEnabled: settings.instagramEnabled,
    youtubeUrl: settings.youtubeUrl ?? "",
    youtubeEnabled: settings.youtubeEnabled,
    tiktokUrl: settings.tiktokUrl ?? "",
    tiktokEnabled: settings.tiktokEnabled,
    whatsappSocialUrl: settings.whatsappSocialUrl ?? "",
    whatsappSocialEnabled: settings.whatsappSocialEnabled,

    showMinistries: settings.showMinistries,
    showLive: settings.showLive,
    showEvents: settings.showEvents,
    showNews: settings.showNews,
    showAgenda: settings.showAgenda,
    showCampuses: settings.showCampuses,
    showHelp: settings.showHelp,

    whatsappDefaultMessage: settings.whatsappDefaultMessage,
    supportPhone: settings.supportPhone ?? "",
    contactEmail: settings.contactEmail ?? "",

    seoTitle: settings.seoTitle ?? "",
    seoDescription: settings.seoDescription ?? "",
    seoImageUrl: settings.seoImageUrl ?? "",

    aboutImageUrl: settings.aboutImageUrl ?? "",
    aboutQuienesSomos: settings.aboutQuienesSomos ?? "",
    aboutMision: settings.aboutMision ?? "",
    aboutVision: settings.aboutVision ?? "",
    aboutValores: settings.aboutValores ?? "",

    helpTitle: settings.helpTitle ?? "",
    helpDescription: settings.helpDescription ?? "",
    helpCtaLabel: settings.helpCtaLabel ?? "",
    helpOptionsTitle: settings.helpOptionsTitle ?? "",

    donationsEnabled: settings.donationsEnabled,
    bankName: settings.bankName ?? "",
    bankAccountType: settings.bankAccountType ?? "",
    bankAccountNumber: settings.bankAccountNumber ?? "",
    bankAccountHolder: settings.bankAccountHolder ?? "",
    nequiNumber: settings.nequiNumber ?? "",
    daviplataNumber: settings.daviplataNumber ?? "",

    maintenanceMode: settings.maintenanceMode,
  };
}
