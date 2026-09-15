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
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  cover_image_url: string | null;
  footer_text: string | null;
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
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    accentColor: row.accent_color,
    coverImageUrl: row.cover_image_url ?? undefined,
    footerText: row.footer_text ?? undefined,
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
    primary_color: settings.primaryColor,
    secondary_color: settings.secondaryColor,
    accent_color: settings.accentColor,
    cover_image_url: settings.coverImageUrl ?? null,
    footer_text: settings.footerText ?? null,
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

    primaryColor: "#7c3aed",
    secondaryColor: "#f59e0b",
    accentColor: "#f59e0b",
    coverImageUrl: undefined,
    footerText: "Diseñado y desarrollado por Providentia Tech · Ibagué, Colombia",

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
