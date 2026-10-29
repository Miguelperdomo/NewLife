import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { LogoMark } from "@/components/ui/LogoMark";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { EventAnnouncementBanner } from "@/components/sections/EventAnnouncementBanner";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { PromoHeroBanner } from "@/components/sections/PromoHeroBanner";
import { TypewriterText } from "@/components/sections/TypewriterText";
import { liveLinks, liveThumbnail } from "@/data/live";
import { siteConfig } from "@/data/site";
import { getCampuses, getHeroPhotos, getMinistries, getUpcomingEvents } from "@/lib/content";
import { getImpactStats } from "@/lib/impactStats";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import { getLiveStatus, youtubeThumbnailUrl } from "@/lib/youtubeLive";

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="px-5 text-center first:pl-0 last:pr-0">
      <p className="font-heading text-2xl font-bold text-white sm:text-3xl">
        <CountUp value={value} />
      </p>
      <p className="text-xs uppercase tracking-wide text-white/60">{label}</p>
    </div>
  );
}

export async function Hero() {
  const [settings, campuses, ministries, heroPhotos, impactStats, upcomingEvents, liveStatus] = await Promise.all([
    getPublicSiteSettings(),
    getCampuses(),
    getMinistries(),
    getHeroPhotos(),
    getImpactStats(),
    getUpcomingEvents(),
    getLiveStatus(),
  ]);
  const churchName = settings?.churchName || siteConfig.name;

  // "En vivo" gana siempre — el interruptor manual de Configuración (para
  // cuando se transmite por algo distinto a YouTube, o mientras no haya
  // claves de YouTube configuradas) se combina con la detección automática.
  const isLive = Boolean(settings?.isLiveManual) || liveStatus.isLive;
  // Sin nada en vivo, el siguiente evento marcado "Mostrar en el Inicio" en
  // el admin se adelanta antes del Hero — distinto de "Destacado" (que es
  // para la cuenta regresiva) — si no hay ninguno, solo se ve el Hero.
  const featuredEvent = upcomingEvents.find((event) => event.highlightHome);

  // Orden fijo cuando hay varias cosas a la vez: en vivo primero, evento
  // destacado segundo, y el Hero normal (logo, frase, estadísticas) siempre
  // al final — nunca se reemplazan entre sí, se apilan.
  let liveBanner: React.ReactNode = null;
  let eventBanner: React.ReactNode = null;

  if (isLive) {
    const youtubeUrl = settings?.youtubeUrl || liveLinks.youtube;
    const facebookUrl = settings?.facebookUrl || liveLinks.facebook;
    const imageSrc =
      settings?.liveThumbnailUrl || (liveStatus.videoId ? youtubeThumbnailUrl(liveStatus.videoId) : liveThumbnail.src);
    const imageLabel = settings?.liveThumbnailAlt || liveThumbnail.alt;

    liveBanner = (
      <PromoHeroBanner
        imageSrc={imageSrc}
        imageLabel={imageLabel}
        sideLabel="En vivo"
        logoUrl={settings?.logoUrl}
        logoAlt={`Logo de ${churchName}`}
      >
        <LiveBadge />
        <h1 className="mt-4 font-heading text-2xl font-bold leading-[1.05] text-white sm:text-3xl md:text-4xl">
          Vive {churchName} estés donde estés.
        </h1>
        <p className="mt-3 max-w-md text-sm text-white/70 sm:text-base">
          Conéctate a nuestras transmisiones, comparte este momento con nosotros y sé parte de nuestra comunidad.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <MagneticButton>
            <Button
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
              className="bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
            >
              <SocialIcon platform="youtube" className="h-4 w-4" />
              Ver transmisión en YouTube
            </Button>
          </MagneticButton>
          {facebookUrl ? (
            <MagneticButton>
              <Button href={facebookUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="lg">
                <SocialIcon platform="facebook" className="h-4 w-4" />
                Ver en Facebook
              </Button>
            </MagneticButton>
          ) : (
            <Button type="button" disabled variant="outline" size="lg" title="Enlace de Facebook próximamente">
              <SocialIcon platform="facebook" className="h-4 w-4" />
              Ver en Facebook
            </Button>
          )}
        </div>
      </PromoHeroBanner>
    );
  }

  if (featuredEvent) {
    const campus = featuredEvent.campus ? campuses.find((item) => item.slug === featuredEvent.campus) : undefined;
    const locationLabel = campus?.name ?? featuredEvent.location;
    // Si el evento tiene una sede fija, "Cómo llegar" va directo a su mapa;
    // si no, manda al listado completo de sedes.
    const directionsHref = campus ? `/sedes/${campus.slug}` : "/sedes";

    eventBanner = (
      <EventAnnouncementBanner
        eventName={featuredEvent.name}
        shortDescription={featuredEvent.shortDescription}
        time={featuredEvent.time}
        locationLabel={locationLabel}
        directionsHref={directionsHref}
        imageSrc={featuredEvent.imageSrc}
        imageLabel={featuredEvent.imageLabel}
        logoUrl={settings?.logoUrl}
        logoAlt={`Logo de ${churchName}`}
        campuses={campuses}
        whatsappNumber={featuredEvent.whatsappNumber ?? settings?.whatsappNumber ?? siteConfig.whatsappNumber}
        registrationUrl={featuredEvent.registrationUrl}
      />
    );
  }

  const tagline = settings?.heroTagline || siteConfig.tagline;
  const description = settings?.description || siteConfig.description;

  const currentYear = new Date().getFullYear();
  const yearsServing =
    settings?.foundingYear && settings.foundingYear > 1900 && settings.foundingYear <= currentYear
      ? currentYear - settings.foundingYear
      : undefined;

  return (
    <>
      {liveBanner}
      {eventBanner}
      <section className="relative overflow-hidden bg-slate-950">
      {heroPhotos.length > 0 ? (
        <HeroCarousel photos={heroPhotos} />
      ) : (
        <PlaceholderImage
          label="[FOTOGRAFÍA / VIDEO PRINCIPAL NEW LIFE]"
          tone="dark"
          className="absolute inset-0 h-full w-full"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />

      <Container className="relative flex min-h-[85vh] flex-col items-center justify-center gap-6 py-24 text-center text-white sm:min-h-[90vh]">
        <LogoMark className="h-20 w-20 rounded-2xl shadow-lg shadow-black/40" src={settings?.logoUrl} alt={`Logo de ${churchName}`} />

        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">{churchName}</span>

        <h1 className="max-w-3xl font-heading text-4xl font-bold leading-[1.02] tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          <span className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
            <TypewriterText text={tagline} />
          </span>
        </h1>

        <p className="max-w-xl text-base text-white/80 sm:text-lg">{description}</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <MagneticButton>
            <Button href="/nosotros" variant="secondary" size="lg">
              Conoce New Life
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button href="/#primeros-pasos" variant="outline" size="lg">
              Quiero ser parte
            </Button>
          </MagneticButton>
        </div>

        {(campuses.length > 0 ||
          ministries.length > 0 ||
          yearsServing !== undefined ||
          impactStats.prayerCount > 0 ||
          impactStats.baptismCount > 0 ||
          impactStats.visitCount > 0) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-4 divide-x divide-white/10 border-t border-white/10 pt-6">
            {campuses.length > 0 && <HeroStat value={campuses.length} label="Campus" />}
            {ministries.length > 0 && <HeroStat value={ministries.length} label="Ministerios" />}
            {yearsServing !== undefined && <HeroStat value={yearsServing} label="Años sirviendo" />}
            {impactStats.baptismCount > 0 && <HeroStat value={impactStats.baptismCount} label="Bautizados" />}
            {impactStats.prayerCount > 0 && <HeroStat value={impactStats.prayerCount} label="Oraciones recibidas" />}
            {impactStats.visitCount > 0 && <HeroStat value={impactStats.visitCount} label="Visitas nuevas" />}
          </div>
        )}
      </Container>
      </section>
    </>
  );
}
