import { siteConfig, socialLinks } from "@/data/site";
import type { AdminSiteSettings } from "@/lib/admin/types";

const SITE_SETTINGS_STORAGE_KEY = "newlife-admin-site-settings-v1";

function findSocialUrl(platform: string) {
  return socialLinks.find((social) => social.platform === platform)?.url;
}

/**
 * Almacén mock de Configuración — singleton (un solo registro, no una
 * lista), archivo propio igual que lib/admin/ministries.ts. Sembrado desde
 * data/site.ts la primera vez; los colores de marca no viven en un archivo
 * de datos (están en app/globals.css como variables CSS), así que se
 * inicializan aquí con los valores actuales de la paleta.
 */
function defaultSiteSettings(): AdminSiteSettings {
  const now = new Date().toISOString();

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

    // Valores actuales de --color-brand-600 / --color-accent-500 en app/globals.css.
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

    updatedAt: now,
  };
}

export function loadSiteSettings(): AdminSiteSettings {
  if (typeof window === "undefined") return defaultSiteSettings();

  const raw = window.localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
  if (!raw) {
    const seeded = defaultSiteSettings();
    saveSiteSettings(seeded);
    return seeded;
  }

  try {
    return JSON.parse(raw) as AdminSiteSettings;
  } catch {
    const seeded = defaultSiteSettings();
    saveSiteSettings(seeded);
    return seeded;
  }
}

export function saveSiteSettings(settings: AdminSiteSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

/** Vuelve a los valores demo (los mismos que el primer sembrado) y los persiste. */
export function resetSiteSettingsToDemo(): AdminSiteSettings {
  const fresh = defaultSiteSettings();
  saveSiteSettings(fresh);
  return fresh;
}
