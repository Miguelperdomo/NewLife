import { Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { liveLinks, liveThumbnail } from "@/data/live";
import { socialLinks } from "@/data/site";
import type { SocialPlatform } from "@/lib/types";

const liveSocialPlatforms: SocialPlatform[] = ["youtube", "facebook", "instagram", "tiktok"];

export function LiveSection() {
  const liveSocials = socialLinks.filter((social) =>
    liveSocialPlatforms.includes(social.platform)
  );

  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <Container className="relative">
        <ScrollReveal>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Texto — segundo en móvil, primero en desktop */}
            <div className="order-2 lg:order-1">
              <LiveBadge />

              <h2 className="mt-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                Vive New Life estés donde estés.
              </h2>
              <p className="mt-4 max-w-md text-base text-white/70 sm:text-lg">
                Conéctate a nuestras transmisiones, comparte este momento con nosotros y sé
                parte de nuestra comunidad.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  href={liveLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
                >
                  <SocialIcon platform="youtube" className="h-4 w-4" />
                  Ver transmisión en YouTube
                </Button>

                {liveLinks.facebook ? (
                  <Button
                    href={liveLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="lg"
                  >
                    <SocialIcon platform="facebook" className="h-4 w-4" />
                    Ver en Facebook
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled
                    variant="outline"
                    size="lg"
                    title="Enlace de Facebook próximamente"
                  >
                    <SocialIcon platform="facebook" className="h-4 w-4" />
                    Ver en Facebook
                  </Button>
                )}
              </div>

              <div className="mt-10 border-t border-white/10 pt-6">
                <p className="text-sm text-white/60">
                  También puedes encontrarnos en nuestras redes
                </p>
                <div className="mt-4 flex gap-3">
                  {liveSocials.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-600"
                    >
                      <SocialIcon platform={social.platform} className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bloque de transmisión — primero en móvil, segundo en desktop */}
            <div className="order-1 lg:order-2">
              <a
                href={liveLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver el canal de YouTube de New Life"
                className="group block overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40"
              >
                {/* La relación de aspecto calca la de la imagen real, para mostrarla
                    completa (sin recortes ni franjas vacías) — ver liveThumbnail. */}
                <div className="relative aspect-[1138/187] w-full overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
                    <PlaceholderImage
                      label={liveThumbnail.alt}
                      src={liveThumbnail.src}
                      tone="dark"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="absolute h-12 w-12 rounded-full bg-red-500/40 blur-lg transition-opacity duration-300 group-hover:opacity-90" />
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12">
                      <Play className="h-4 w-4 translate-x-0.5 fill-current sm:h-5 sm:w-5" aria-hidden="true" />
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <LiveBadge />
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60">
                    <SocialIcon platform="youtube" className="h-4 w-4" />
                    Ver canal
                  </span>
                </div>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
