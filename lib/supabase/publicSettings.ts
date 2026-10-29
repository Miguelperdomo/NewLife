import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/publicClient";

/**
 * Configuración leída desde Supabase para el sitio PÚBLICO (Footer, colores
 * globales, SEO, mantenimiento...) — distinto de lib/admin/siteSettings.ts,
 * que es la versión completa para el panel admin. `cache()` evita pedirla
 * más de una vez por request aunque varios componentes (layout raíz,
 * Footer, Navbar...) la usen. Devuelve `null` si todavía no se ha guardado
 * nada en Configuración — quien la use debe tener un buen valor de respaldo
 * para ese caso.
 *
 * Usa el cliente SIN cookies a propósito (createPublicClient, igual que
 * lib/content.ts) — esta es una lectura pública, sin sesión de por medio.
 * El cliente CON cookies (lib/supabase/server.ts) obliga a Next.js a tratar
 * cualquier página que lo use como "dinámica" en cada visita, sin importar
 * qué tan corto o largo pongas `revalidate` ahí — como esta función la usa
 * prácticamente TODA página pública (Footer, Navbar, cada page.tsx...), ese
 * único detalle bastaba para que ninguna página pública se pudiera cachear,
 * ni siquiera agregando `export const revalidate`.
 */
export interface PublicSiteSettings {
  churchName: string;
  description?: string;
  email?: string;
  phone?: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  address?: string;
  city?: string;
  heroTagline?: string;
  foundingYear?: number;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  accentColor: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  whatsappSocialUrl?: string;
  whatsappSocialEnabled: boolean;
  showMinistries: boolean;
  showLive: boolean;
  isLiveManual: boolean;
  showEvents: boolean;
  showNews: boolean;
  showAgenda: boolean;
  showCampuses: boolean;
  showHelp: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoImageUrl?: string;
  aboutImageUrl?: string;
  aboutQuienesSomos?: string;
  aboutMision?: string;
  aboutVision?: string;
  aboutValores?: string;
  helpTitle?: string;
  helpDescription?: string;
  helpCtaLabel?: string;
  helpOptionsTitle?: string;
  firstTimeEyebrow?: string;
  firstTimeTitle?: string;
  firstTimeDescription?: string;
  firstTimeCtaLabel?: string;
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
  pastorsEyebrow?: string;
  pastorsTitle?: string;
  pastorsDescription?: string;
  liveThumbnailUrl?: string;
  liveThumbnailAlt?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  maintenanceMode: boolean;
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
}

interface SettingsRow {
  church_name: string;
  description: string | null;
  phone: string | null;
  whatsapp_number: string;
  whatsapp_default_message: string;
  email: string | null;
  address: string | null;
  city: string | null;
  hero_tagline: string | null;
  founding_year: number | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  accent_color: string;
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
  is_live_manual: boolean;
  show_events: boolean;
  show_news: boolean;
  show_agenda: boolean;
  show_campuses: boolean;
  show_help: boolean;
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
  maintenance_mode: boolean;
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
}

const SETTINGS_COLUMNS =
  "church_name, description, phone, whatsapp_number, whatsapp_default_message, email, address, city, hero_tagline, founding_year, logo_url, favicon_url, primary_color, accent_color, facebook_url, facebook_enabled, instagram_url, instagram_enabled, youtube_url, youtube_enabled, tiktok_url, tiktok_enabled, whatsapp_social_url, whatsapp_social_enabled, show_ministries, show_live, is_live_manual, show_events, show_news, show_agenda, show_campuses, show_help, seo_title, seo_description, seo_image_url, about_image_url, about_quienes_somos, about_mision, about_vision, about_valores, help_title, help_description, help_cta_label, help_options_title, first_time_eyebrow, first_time_title, first_time_description, first_time_cta_label, ministries_eyebrow, ministries_title, ministries_description, campuses_eyebrow, campuses_title, campuses_description, events_eyebrow, events_title, events_description, news_eyebrow, news_title, news_description, pastors_eyebrow, pastors_title, pastors_description, live_thumbnail_url, live_thumbnail_alt, privacy_policy, terms_of_service, maintenance_mode, donations_enabled, donation_title, donation_teaser, donation_description, bank_name, bank_account_type, bank_account_number, bank_account_holder, nequi_number, daviplata_number";

export const getPublicSiteSettings = cache(async (): Promise<PublicSiteSettings | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select(SETTINGS_COLUMNS)
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as SettingsRow;

  return {
    churchName: row.church_name,
    description: row.description ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    whatsappNumber: row.whatsapp_number,
    whatsappDefaultMessage: row.whatsapp_default_message,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    heroTagline: row.hero_tagline ?? undefined,
    foundingYear: row.founding_year ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    faviconUrl: row.favicon_url ?? undefined,
    primaryColor: row.primary_color,
    accentColor: row.accent_color,
    facebookUrl: row.facebook_enabled ? (row.facebook_url ?? undefined) : undefined,
    instagramUrl: row.instagram_enabled ? (row.instagram_url ?? undefined) : undefined,
    youtubeUrl: row.youtube_enabled ? (row.youtube_url ?? undefined) : undefined,
    tiktokUrl: row.tiktok_enabled ? (row.tiktok_url ?? undefined) : undefined,
    whatsappSocialUrl: row.whatsapp_social_enabled ? (row.whatsapp_social_url ?? undefined) : undefined,
    whatsappSocialEnabled: row.whatsapp_social_enabled,
    showMinistries: row.show_ministries,
    showLive: row.show_live,
    isLiveManual: row.is_live_manual,
    showEvents: row.show_events,
    showNews: row.show_news,
    showAgenda: row.show_agenda,
    showCampuses: row.show_campuses,
    showHelp: row.show_help,
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
    maintenanceMode: row.maintenance_mode,
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
  };
});
