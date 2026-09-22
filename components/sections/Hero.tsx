import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/LogoMark";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { siteConfig } from "@/data/site";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

export async function Hero() {
  const settings = await getPublicSiteSettings();
  const churchName = settings?.churchName || siteConfig.name;
  const tagline = settings?.heroTagline || siteConfig.tagline;
  const description = settings?.description || siteConfig.description;

  return (
    <section className="relative overflow-hidden bg-slate-950">
      <PlaceholderImage
        label="[FOTOGRAFÍA / VIDEO PRINCIPAL NEW LIFE]"
        tone="dark"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />

      <Container className="relative flex min-h-[85vh] flex-col items-center justify-center gap-6 py-24 text-center text-white sm:min-h-[90vh]">
        <LogoMark className="h-20 w-20 rounded-2xl shadow-lg shadow-black/40" src={settings?.logoUrl} alt={`Logo de ${churchName}`} />

        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">{churchName}</span>

        <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          {tagline}
        </h1>

        <p className="max-w-xl text-base text-white/80 sm:text-lg">{description}</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button href="/nosotros" variant="secondary" size="lg">
            Conoce New Life
          </Button>
          <Button href="/ministerios" variant="outline" size="lg">
            Quiero ser parte
          </Button>
        </div>
      </Container>
    </section>
  );
}
