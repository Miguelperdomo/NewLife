import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { siteConfig } from "@/data/site";
import { generateColorShades } from "@/lib/color";
import { buildOpenGraphMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import "./globals.css";

// Sin dominio propio todavía: NEXT_PUBLIC_SITE_URL queda pendiente de fijar
// el día que se publique el sitio (ver .env.local). Mientras tanto cae en
// localhost, que solo importa para pruebas locales de Open Graph.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// Título/descripción/imagen de Configuración > SEO y compartir tienen
// prioridad; si quedan vacíos (todavía no se guardó nada ahí), se cae a los
// valores fijos de siempre para que el sitio nunca se quede sin metadata.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const title = settings?.seoTitle || `${siteConfig.name} — ${siteConfig.tagline}`;
  const description = settings?.seoDescription || siteConfig.description;
  const churchName = settings?.churchName || siteConfig.name;
  const icon = settings?.faviconUrl || settings?.logoUrl;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    // Providentia Tech = quien construyó el sitio, no New Life — crédito de
    // desarrollador, invisible al navegar pero visible en el código fuente y
    // para herramientas SEO (ver también /humans.txt y el JSON-LD del footer).
    authors: [{ name: "Providentia Tech", url: "https://wa.me/573133854821" }],
    icons: icon ? { icon, apple: icon } : undefined,
    // "Agregar a pantalla de inicio" en iPhone (Android usa /manifest.webmanifest,
    // ver app/manifest.ts) — sin esto, Safari abre como una pestaña más, no a
    // pantalla completa con el nombre de la iglesia.
    appleWebApp: { capable: true, statusBarStyle: "default", title: churchName },
    ...buildOpenGraphMetadata({ title, description, imageSrc: settings?.seoImageUrl }),
  };
}

function toCssVars(prefix: string, shades: Record<string, string>) {
  return Object.entries(shades)
    .map(([shade, hex]) => `--color-${prefix}-${shade}: ${hex};`)
    .join("");
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getPublicSiteSettings();
  const brandShades = settings ? generateColorShades(settings.primaryColor) : null;
  const accentShades = settings ? generateColorShades(settings.accentColor) : null;

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col bg-white text-slate-900"
        suppressHydrationWarning
      >
        {/* Recoloreado real del sitio a partir de Configuración — ver
            lib/color.ts y app/globals.css (las variables de color ya no
            están "horneadas" en cada clase, así que sobreescribirlas aquí sí
            cambia todo lo que use bg-brand-600, text-accent-500, etc.).
            Renderizado dentro de <body> a propósito: como hijo directo de
            <html> (antes de <body>) es HTML inválido y React lo detecta como
            un error de hidratación — desde aquí adentro, React 19 lo sigue
            subiendo solo a la cabecera del documento, pero sin ese error. */}
        {(brandShades || accentShades) && (
          <style>{`:root{${brandShades ? toCssVars("brand", brandShades) : ""}${accentShades ? toCssVars("accent", accentShades) : ""}}`}</style>
        )}
        {children}
      </body>
    </html>
  );
}
