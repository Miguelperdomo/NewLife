import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/LogoMark";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

// banner "en vivo": texto a la izquierda, foto a la derecha. el evento
// destacado usa su propio diseño (EventAnnouncementBanner); el Hero normal
// no usa nada de esto
export function PromoHeroBanner({
  imageSrc,
  imageLabel,
  sideLabel,
  logoUrl,
  logoAlt,
  children,
}: {
  imageSrc?: string;
  imageLabel: string;
  sideLabel: string;
  logoUrl?: string;
  logoAlt: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
      <Container className="relative grid gap-10 py-12 sm:gap-8 sm:py-12 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-14">
        <div>{children}</div>

        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm sm:pr-8">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl shadow-xl shadow-slate-900/10 sm:aspect-[4/3]">
            <PlaceholderImage label={imageLabel} src={imageSrc} fit="contain" tone="dark" className="h-full w-full" />
          </div>

          <span className="absolute -top-3 right-1 flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white p-2 shadow-lg sm:h-12 sm:w-12">
            <LogoMark className="h-full w-full rounded-full" src={logoUrl} alt={logoAlt} />
          </span>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-1 top-1/2 hidden -translate-y-1/2 whitespace-nowrap font-heading text-3xl font-bold uppercase tracking-tight text-white/10 [writing-mode:vertical-rl] sm:block"
          >
            {sideLabel}
          </span>
        </div>
      </Container>
    </section>
  );
}
