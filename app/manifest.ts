import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

/**
 * Genera /manifest.webmanifest — lo que permite "Agregar a pantalla de
 * inicio" en el celular (Android ofrece instalarlo solo; en iPhone la
 * persona lo hace a mano desde Compartir → Agregar a inicio en Safari).
 * Usa el logo/nombre/color que ya haya en Configuración, igual que el resto
 * del sitio — si no hay nada guardado, cae a los valores fijos de siempre.
 *
 * El ícono usa la foto de logo tal cual está (no un PNG cuadrado dedicado) —
 * funciona, pero para verse perfecto como ícono de app lo ideal es subir más
 * adelante una versión cuadrada del logo en Configuración.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getPublicSiteSettings();
  const name = settings?.churchName || siteConfig.name;
  const icon = settings?.logoUrl || siteConfig.logoSrc;

  return {
    name,
    short_name: name,
    description: settings?.description || siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: settings?.primaryColor || "#7c3aed",
    icons: [
      { src: icon, sizes: "192x192", purpose: "any" },
      { src: icon, sizes: "512x512", purpose: "any" },
    ],
  };
}
