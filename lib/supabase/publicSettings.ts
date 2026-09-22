import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Configuración leída desde Supabase para el sitio PÚBLICO (Footer, colores
 * globales, SEO, mantenimiento...) — distinto de lib/admin/siteSettings.ts,
 * que es la versión completa para el panel admin. `cache()` evita pedirla
 * más de una vez por request aunque varios componentes (layout raíz,
 * Footer, Navbar...) la usen. Devuelve `null` si todavía no se ha guardado
 * nada en Configuración — quien la use debe tener un buen valor de respaldo
 * para ese caso.
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
  generalSchedule?: string;
  heroTagline?: string;
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
  maintenanceMode: boolean;
  donationsEnabled: boolean;
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
  general_schedule: string | null;
  hero_tagline: string | null;
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
  maintenance_mode: boolean;
  donations_enabled: boolean;
  bank_name: string | null;
  bank_account_type: string | null;
  bank_account_number: string | null;
  bank_account_holder: string | null;
  nequi_number: string | null;
  daviplata_number: string | null;
}

const SETTINGS_COLUMNS =
  "church_name, description, phone, whatsapp_number, whatsapp_default_message, email, address, city, general_schedule, hero_tagline, logo_url, favicon_url, primary_color, accent_color, facebook_url, facebook_enabled, instagram_url, instagram_enabled, youtube_url, youtube_enabled, tiktok_url, tiktok_enabled, whatsapp_social_url, whatsapp_social_enabled, show_ministries, show_live, show_events, show_news, show_agenda, show_campuses, show_help, seo_title, seo_description, seo_image_url, about_image_url, about_quienes_somos, about_mision, about_vision, about_valores, help_title, help_description, help_cta_label, help_options_title, maintenance_mode, donations_enabled, bank_name, bank_account_type, bank_account_number, bank_account_holder, nequi_number, daviplata_number";

export const getPublicSiteSettings = cache(async (): Promise<PublicSiteSettings | null> => {
  const supabase = await createClient();
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
    generalSchedule: row.general_schedule ?? undefined,
    heroTagline: row.hero_tagline ?? undefined,
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
    maintenanceMode: row.maintenance_mode,
    donationsEnabled: row.donations_enabled,
    bankName: row.bank_name ?? undefined,
    bankAccountType: row.bank_account_type ?? undefined,
    bankAccountNumber: row.bank_account_number ?? undefined,
    bankAccountHolder: row.bank_account_holder ?? undefined,
    nequiNumber: row.nequi_number ?? undefined,
    daviplataNumber: row.daviplata_number ?? undefined,
  };
});
