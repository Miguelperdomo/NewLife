import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Container } from "@/components/ui/Container";
import { getPastors } from "@/lib/content";
import type { Pastor } from "@/lib/types";
import { PastorCard } from "./PastorCard";

/**
 * Plantilla única reutilizada por todas las páginas /pastores/[slug].
 * Análoga a MinistryTemplate/EventTemplate: solo cambian los datos.
 */
export function PastorTemplate({ pastor }: { pastor: Pastor }) {
  const paragraphs = pastor.bio.split("\n\n").filter(Boolean);
  const others = getPastors().filter((item) => item.slug !== pastor.slug);

  return (
    <>
      <Breadcrumbs items={[{ label: "Pastores", href: "/pastores" }, { label: pastor.name }]} />

      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
        </div>

        <Container className="relative flex flex-col items-center gap-4 text-center text-white">
          <Link
            href="/pastores"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Pastores
          </Link>

          <div className="mt-4 h-40 w-40 overflow-hidden rounded-full border-4 border-white/10 shadow-xl shadow-black/40 sm:h-48 sm:w-48">
            <PlaceholderImage
              label={pastor.imageLabel}
              src={pastor.imageSrc}
              tone="dark"
              className="h-full w-full"
            />
          </div>

          <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">{pastor.name}</h1>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-400">{pastor.role}</p>

          {pastor.social && pastor.social.length > 0 && (
            <div className="mt-2 flex gap-3">
              {pastor.social.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-600"
                >
                  <SocialIcon platform={social.platform} className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-slate-900">Biografía</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-600">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>

      {others.length > 0 && (
        <section className="bg-slate-950 py-16 sm:py-24">
          <Container>
            <SectionHeading eyebrow="Liderazgo" title="Otros líderes" tone="dark" />
            <div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-10">
              {others.map((item) => (
                <PastorCard key={item.slug} pastor={item} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
