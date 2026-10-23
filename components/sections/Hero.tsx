import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { LogoMark } from "@/components/ui/LogoMark";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { TypewriterText } from "@/components/sections/TypewriterText";
import { siteConfig } from "@/data/site";
import { getCampuses, getHeroPhotos, getMinistries } from "@/lib/content";
import { getImpactStats } from "@/lib/impactStats";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

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
  const [settings, campuses, ministries, heroPhotos, impactStats] = await Promise.all([
    getPublicSiteSettings(),
    getCampuses(),
    getMinistries(),
    getHeroPhotos(),
    getImpactStats(),
  ]);
  const churchName = settings?.churchName || siteConfig.name;
  const tagline = settings?.heroTagline || siteConfig.tagline;
  const description = settings?.description || siteConfig.description;

  const currentYear = new Date().getFullYear();
  const yearsServing =
    settings?.foundingYear && settings.foundingYear > 1900 && settings.foundingYear <= currentYear
      ? currentYear - settings.foundingYear
      : undefined;

  return (
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
  );
}
