import { Wrench } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageFadeIn } from "@/components/layout/PageFadeIn";
import { PageViewTracker } from "@/components/layout/PageViewTracker";
import { ProvidentiaJsonLd } from "@/components/layout/ProvidentiaJsonLd";
import { RouteProgressBar } from "@/components/layout/RouteProgressBar";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";
import { LogoMark } from "@/components/ui/LogoMark";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { siteConfig } from "@/data/site";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

// Cachea cada página pública por 60 segundos — durante una ráfaga de
// muchas visitas al mismo tiempo (ej. el día de la presentación), Supabase
// solo recibe UNA consulta por página cada 60 segundos, sin importar cuánta
// gente entre en ese rato; el resto recibe la versión guardada al instante.
// No aplica al panel admin (vive fuera de este layout, en app/admin/...),
// que siempre necesita datos al momento.
export const revalidate = 60;

/**
 * Pantalla mostrada cuando Configuración > Modo mantenimiento está activo.
 * Solo afecta al sitio público — el panel admin vive fuera de este layout
 * (app/admin/...), así que sigue accesible para volver a apagarlo.
 */
function MaintenanceScreen({ logoUrl, churchName }: { logoUrl?: string; churchName?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-6 text-center text-white">
      <LogoMark className="h-16 w-16 rounded-full" src={logoUrl} alt={`Logo de ${churchName || siteConfig.name}`} />
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/80">
        <Wrench className="h-5 w-5" aria-hidden="true" />
      </span>
      <h1 className="font-heading text-2xl font-bold sm:text-3xl">Volvemos muy pronto</h1>
      <p className="max-w-md text-sm leading-relaxed text-white/70">
        Estamos haciendo algunos ajustes en el sitio de {churchName || siteConfig.name}. Vuelve a
        visitarnos en un momento.
      </p>
    </div>
  );
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSiteSettings();

  if (settings?.maintenanceMode) {
    return <MaintenanceScreen logoUrl={settings.logoUrl} churchName={settings.churchName} />;
  }

  return (
    <>
      <ProvidentiaJsonLd />
      <RouteProgressBar />
      <ScrollProgressBar />
      <PageViewTracker />
      <Navbar logoUrl={settings?.logoUrl} churchName={settings?.churchName} youtubeUrl={settings?.youtubeUrl} />
      <main className="flex-1">
        <PageFadeIn>{children}</PageFadeIn>
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
