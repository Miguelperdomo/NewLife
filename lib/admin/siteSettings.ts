import { createClient } from "@/lib/supabase/client";
import { siteConfig, socialLinks } from "@/data/site";
import type { AdminSiteSettings } from "@/lib/admin/types";

/**
 * Configuración es un singleton en Supabase (tabla `site_settings`, fila
 * fija id=1 — ver la restricción CHECK creada junto con la tabla). El
 * upsert con onConflict:"id" cubre tanto el primer guardado (INSERT) como
 * los siguientes (UPDATE) sin tener que distinguir los dos casos aquí.
 */
const SETTINGS_ROW_ID = 1;

interface SiteSettingsRow {
  id: number;
  church_name: string;
  description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  phone: string | null;
  whatsapp_number: string;
  email: string | null;
  address: string | null;
  city: string | null;
  general_schedule: string | null;
  hero_tagline: string | null;
  founding_year: number | null;
  primary_color: string;
  accent_color: string;
  cover_image_url: string | null;
  facebook_url: string | null;
  facebook_enabled: boolean;
  instagram_url: string | null;
  instagram_enabled: boolean;
  youtube_url: string | null;
  youtube_enabled: boolean;
  tiktok_url: string | null;
  tiktok_enabled: boolean;
  whatsapp_social_url: string | null;
  whatsapp_social_enabled: boolean;
  show_ministries: boolean;
  show_live: boolean;
  show_events: boolean;
  show_news: boolean;
  show_agenda: boolean;
  show_campuses: boolean;
  show_help: boolean;
  whatsapp_default_message: string;
  support_phone: string | null;
  contact_email: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image_url: string | null;
  about_image_url: string | null;
  about_quienes_somos: string | null;
  about_mision: string | null;
  about_vision: string | null;
  about_valores: string | null;
  help_title: string | null;
  help_description: string | null;
  help_cta_label: string | null;
  help_options_title: string | null;
  first_time_eyebrow: string | null;
  first_time_title: string | null;
  first_time_description: string | null;
  first_time_cta_label: string | null;
  ministries_eyebrow: string | null;
  ministries_title: string | null;
  ministries_description: string | null;
  campuses_eyebrow: string | null;
  campuses_title: string | null;
  campuses_description: string | null;
  events_eyebrow: string | null;
  events_title: string | null;
  events_description: string | null;
  news_eyebrow: string | null;
  news_title: string | null;
  news_description: string | null;
  pastors_eyebrow: string | null;
  pastors_title: string | null;
  pastors_description: string | null;
  live_thumbnail_url: string | null;
  live_thumbnail_alt: string | null;
  privacy_policy: string | null;
  terms_of_service: string | null;
  donations_enabled: boolean;
  donation_title: string | null;
  donation_teaser: string | null;
  donation_description: string | null;
  bank_name: string | null;
  bank_account_type: string | null;
  bank_account_number: string | null;
  bank_account_holder: string | null;
  nequi_number: string | null;
  daviplata_number: string | null;
  maintenance_mode: boolean;
  updated_at: string;
}

function rowToSettings(row: SiteSettingsRow): AdminSiteSettings {
  return {
    churchName: row.church_name,
    description: row.description ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    faviconUrl: row.favicon_url ?? undefined,
    phone: row.phone ?? undefined,
    whatsappNumber: row.whatsapp_number,
    email: row.email ?? undefined,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    generalSchedule: row.general_schedule ?? undefined,
    heroTagline: row.hero_tagline ?? undefined,
    foundingYear: row.founding_year ?? undefined,
    primaryColor: row.primary_color,
    accentColor: row.accent_color,
    coverImageUrl: row.cover_image_url ?? undefined,
    facebookUrl: row.facebook_url ?? undefined,
    facebookEnabled: row.facebook_enabled,
    instagramUrl: row.instagram_url ?? undefined,
    instagramEnabled: row.instagram_enabled,
    youtubeUrl: row.youtube_url ?? undefined,
    youtubeEnabled: row.youtube_enabled,
    tiktokUrl: row.tiktok_url ?? undefined,
    tiktokEnabled: row.tiktok_enabled,
    whatsappSocialUrl: row.whatsapp_social_url ?? undefined,
    whatsappSocialEnabled: row.whatsapp_social_enabled,
    showMinistries: row.show_ministries,
    showLive: row.show_live,
    showEvents: row.show_events,
    showNews: row.show_news,
    showAgenda: row.show_agenda,
    showCampuses: row.show_campuses,
    showHelp: row.show_help,
    whatsappDefaultMessage: row.whatsapp_default_message,
    supportPhone: row.support_phone ?? undefined,
    contactEmail: row.contact_email ?? undefined,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    seoImageUrl: row.seo_image_url ?? undefined,
    aboutImageUrl: row.about_image_url ?? undefined,
    aboutQuienesSomos: row.about_quienes_somos ?? undefined,
    aboutMision: row.about_mision ?? undefined,
    aboutVision: row.about_vision ?? undefined,
    aboutValores: row.about_valores ?? undefined,
    helpTitle: row.help_title ?? undefined,
    helpDescription: row.help_description ?? undefined,
    helpCtaLabel: row.help_cta_label ?? undefined,
    helpOptionsTitle: row.help_options_title ?? undefined,
    firstTimeEyebrow: row.first_time_eyebrow ?? undefined,
    firstTimeTitle: row.first_time_title ?? undefined,
    firstTimeDescription: row.first_time_description ?? undefined,
    firstTimeCtaLabel: row.first_time_cta_label ?? undefined,
    ministriesEyebrow: row.ministries_eyebrow ?? undefined,
    ministriesTitle: row.ministries_title ?? undefined,
    ministriesDescription: row.ministries_description ?? undefined,
    campusesEyebrow: row.campuses_eyebrow ?? undefined,
    campusesTitle: row.campuses_title ?? undefined,
    campusesDescription: row.campuses_description ?? undefined,
    eventsEyebrow: row.events_eyebrow ?? undefined,
    eventsTitle: row.events_title ?? undefined,
    eventsDescription: row.events_description ?? undefined,
    newsEyebrow: row.news_eyebrow ?? undefined,
    newsTitle: row.news_title ?? undefined,
    newsDescription: row.news_description ?? undefined,
    pastorsEyebrow: row.pastors_eyebrow ?? undefined,
    pastorsTitle: row.pastors_title ?? undefined,
    pastorsDescription: row.pastors_description ?? undefined,
    liveThumbnailUrl: row.live_thumbnail_url ?? undefined,
    liveThumbnailAlt: row.live_thumbnail_alt ?? undefined,
    privacyPolicy: row.privacy_policy ?? undefined,
    termsOfService: row.terms_of_service ?? undefined,
    donationsEnabled: row.donations_enabled,
    donationTitle: row.donation_title ?? undefined,
    donationTeaser: row.donation_teaser ?? undefined,
    donationDescription: row.donation_description ?? undefined,
    bankName: row.bank_name ?? undefined,
    bankAccountType: row.bank_account_type ?? undefined,
    bankAccountNumber: row.bank_account_number ?? undefined,
    bankAccountHolder: row.bank_account_holder ?? undefined,
    nequiNumber: row.nequi_number ?? undefined,
    daviplataNumber: row.daviplata_number ?? undefined,
    maintenanceMode: row.maintenance_mode,
    updatedAt: row.updated_at,
  };
}

function settingsToRow(settings: AdminSiteSettings) {
  return {
    id: SETTINGS_ROW_ID,
    church_name: settings.churchName,
    description: settings.description ?? null,
    logo_url: settings.logoUrl ?? null,
    favicon_url: settings.faviconUrl ?? null,
    phone: settings.phone ?? null,
    whatsapp_number: settings.whatsappNumber,
    email: settings.email ?? null,
    address: settings.address ?? null,
    city: settings.city ?? null,
    general_schedule: settings.generalSchedule ?? null,
    hero_tagline: settings.heroTagline ?? null,
    founding_year: settings.foundingYear ?? null,
    primary_color: settings.primaryColor,
    accent_color: settings.accentColor,
    cover_image_url: settings.coverImageUrl ?? null,
    facebook_url: settings.facebookUrl ?? null,
    facebook_enabled: settings.facebookEnabled,
    instagram_url: settings.instagramUrl ?? null,
    instagram_enabled: settings.instagramEnabled,
    youtube_url: settings.youtubeUrl ?? null,
    youtube_enabled: settings.youtubeEnabled,
    tiktok_url: settings.tiktokUrl ?? null,
    tiktok_enabled: settings.tiktokEnabled,
    whatsapp_social_url: settings.whatsappSocialUrl ?? null,
    whatsapp_social_enabled: settings.whatsappSocialEnabled,
    show_ministries: settings.showMinistries,
    show_live: settings.showLive,
    show_events: settings.showEvents,
    show_news: settings.showNews,
    show_agenda: settings.showAgenda,
    show_campuses: settings.showCampuses,
    show_help: settings.showHelp,
    whatsapp_default_message: settings.whatsappDefaultMessage,
    support_phone: settings.supportPhone ?? null,
    contact_email: settings.contactEmail ?? null,
    seo_title: settings.seoTitle ?? null,
    seo_description: settings.seoDescription ?? null,
    seo_image_url: settings.seoImageUrl ?? null,
    about_image_url: settings.aboutImageUrl ?? null,
    about_quienes_somos: settings.aboutQuienesSomos ?? null,
    about_mision: settings.aboutMision ?? null,
    about_vision: settings.aboutVision ?? null,
    about_valores: settings.aboutValores ?? null,
    help_title: settings.helpTitle ?? null,
    help_description: settings.helpDescription ?? null,
    help_cta_label: settings.helpCtaLabel ?? null,
    help_options_title: settings.helpOptionsTitle ?? null,
    first_time_eyebrow: settings.firstTimeEyebrow ?? null,
    first_time_title: settings.firstTimeTitle ?? null,
    first_time_description: settings.firstTimeDescription ?? null,
    first_time_cta_label: settings.firstTimeCtaLabel ?? null,
    ministries_eyebrow: settings.ministriesEyebrow ?? null,
    ministries_title: settings.ministriesTitle ?? null,
    ministries_description: settings.ministriesDescription ?? null,
    campuses_eyebrow: settings.campusesEyebrow ?? null,
    campuses_title: settings.campusesTitle ?? null,
    campuses_description: settings.campusesDescription ?? null,
    events_eyebrow: settings.eventsEyebrow ?? null,
    events_title: settings.eventsTitle ?? null,
    events_description: settings.eventsDescription ?? null,
    news_eyebrow: settings.newsEyebrow ?? null,
    news_title: settings.newsTitle ?? null,
    news_description: settings.newsDescription ?? null,
    pastors_eyebrow: settings.pastorsEyebrow ?? null,
    pastors_title: settings.pastorsTitle ?? null,
    pastors_description: settings.pastorsDescription ?? null,
    live_thumbnail_url: settings.liveThumbnailUrl ?? null,
    live_thumbnail_alt: settings.liveThumbnailAlt ?? null,
    privacy_policy: settings.privacyPolicy ?? null,
    terms_of_service: settings.termsOfService ?? null,
    donations_enabled: settings.donationsEnabled,
    donation_title: settings.donationTitle ?? null,
    donation_teaser: settings.donationTeaser ?? null,
    donation_description: settings.donationDescription ?? null,
    bank_name: settings.bankName ?? null,
    bank_account_type: settings.bankAccountType ?? null,
    bank_account_number: settings.bankAccountNumber ?? null,
    bank_account_holder: settings.bankAccountHolder ?? null,
    nequi_number: settings.nequiNumber ?? null,
    daviplata_number: settings.daviplataNumber ?? null,
    maintenance_mode: settings.maintenanceMode,
  };
}

function findSocialUrl(platform: string) {
  return socialLinks.find((social) => social.platform === platform)?.url;
}

/**
 * Valores de arranque cuando todavía no existe la fila en Supabase (antes
 * del primer guardado). Nunca se escriben solos — solo se ven en el
 * formulario hasta que el administrador le da "Guardar" o "Restablecer".
 */
function defaultSiteSettings(): AdminSiteSettings {
  return {
    churchName: siteConfig.name,
    description: siteConfig.description,
    logoUrl: siteConfig.logoSrc,
    faviconUrl: undefined,
    phone: siteConfig.contactPhone,
    whatsappNumber: siteConfig.whatsappNumber,
    email: siteConfig.contactEmail,
    address: undefined,
    city: undefined,
    generalSchedule: undefined,

    heroTagline: undefined,
    foundingYear: undefined,

    primaryColor: "#7c3aed",
    accentColor: "#f59e0b",
    coverImageUrl: undefined,

    facebookUrl: findSocialUrl("facebook"),
    facebookEnabled: Boolean(findSocialUrl("facebook")),
    instagramUrl: findSocialUrl("instagram"),
    instagramEnabled: Boolean(findSocialUrl("instagram")),
    youtubeUrl: findSocialUrl("youtube"),
    youtubeEnabled: Boolean(findSocialUrl("youtube")),
    tiktokUrl: findSocialUrl("tiktok"),
    tiktokEnabled: Boolean(findSocialUrl("tiktok")),
    whatsappSocialUrl: findSocialUrl("whatsapp"),
    whatsappSocialEnabled: Boolean(findSocialUrl("whatsapp")),

    showMinistries: true,
    showLive: true,
    showEvents: true,
    showNews: true,
    showAgenda: true,
    showCampuses: true,
    showHelp: true,

    whatsappDefaultMessage: "Hola New Life, quisiera más información.",
    supportPhone: undefined,
    contactEmail: undefined,

    seoTitle: undefined,
    seoDescription: undefined,
    seoImageUrl: undefined,

    aboutImageUrl: undefined,
    aboutQuienesSomos: undefined,
    aboutMision: undefined,
    aboutVision: undefined,
    aboutValores: undefined,

    helpTitle: undefined,
    helpDescription: undefined,
    helpCtaLabel: undefined,
    helpOptionsTitle: undefined,

    firstTimeEyebrow: undefined,
    firstTimeTitle: undefined,
    firstTimeDescription: undefined,
    firstTimeCtaLabel: undefined,

    ministriesEyebrow: undefined,
    ministriesTitle: undefined,
    ministriesDescription: undefined,
    campusesEyebrow: undefined,
    campusesTitle: undefined,
    campusesDescription: undefined,
    eventsEyebrow: undefined,
    eventsTitle: undefined,
    eventsDescription: undefined,
    newsEyebrow: undefined,
    newsTitle: undefined,
    newsDescription: undefined,
    pastorsEyebrow: undefined,
    pastorsTitle: undefined,
    pastorsDescription: undefined,

    liveThumbnailUrl: undefined,
    liveThumbnailAlt: undefined,

    privacyPolicy: undefined,
    termsOfService: undefined,

    donationsEnabled: false,
    donationTitle: undefined,
    donationTeaser: undefined,
    donationDescription: undefined,
    bankName: undefined,
    bankAccountType: undefined,
    bankAccountNumber: undefined,
    bankAccountHolder: undefined,
    nequiNumber: undefined,
    daviplataNumber: undefined,

    maintenanceMode: false,

    updatedAt: new Date().toISOString(),
  };
}

export async function loadSiteSettings(): Promise<AdminSiteSettings> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", SETTINGS_ROW_ID)
    .maybeSingle();

  if (error || !data) return defaultSiteSettings();
  return rowToSettings(data as SiteSettingsRow);
}

export async function saveSiteSettings(settings: AdminSiteSettings): Promise<AdminSiteSettings> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert(settingsToRow(settings), { onConflict: "id" })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "No se pudo guardar la configuración.");
  }
  return rowToSettings(data as SiteSettingsRow);
}

/** Vuelve a los valores demo y los guarda en Supabase. */
export async function resetSiteSettingsToDemo(): Promise<AdminSiteSettings> {
  return saveSiteSettings(defaultSiteSettings());
}
