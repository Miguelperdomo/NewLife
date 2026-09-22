import type { Metadata } from "next";
import { Clock, Compass, Eye, HandHeart, Mail, MapPin, Phone, Users } from "lucide-react";
import type { ComponentType } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { buildOpenGraphMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

export const metadata: Metadata = {
  title: `Conoce New Life — ${siteConfig.name}`,
  description: siteConfig.description,
  ...buildOpenGraphMetadata({
    title: `Conoce New Life — ${siteConfig.name}`,
    description: siteConfig.description,
  }),
};

const FALLBACK_TEXT: Record<"quienesSomos" | "mision" | "vision" | "valores", string> = {
  quienesSomos:
    "[CONTENIDO TEMPORAL] New Life es una comunidad cristiana que camina junto a personas de todas las edades, ayudándolas a conocer a Dios, crecer en fe y encontrar un lugar al cual pertenecer.",
  mision:
    "[CONTENIDO TEMPORAL] Guiar a las personas a encontrar una nueva vida en Cristo, acompañándolas en cada etapa de su crecimiento espiritual.",
  vision: "[CONTENIDO TEMPORAL] Ser una iglesia relevante para cada generación, llevando esperanza dentro y fuera de nuestras puertas.",
  valores: "[CONTENIDO TEMPORAL] Fe, comunidad, servicio, excelencia y autenticidad guían todo lo que hacemos como iglesia.",
};

export default async function NosotrosPage() {
  const settings = await getPublicSiteSettings();

  const blocks: {
    icon: ComponentType<{ className?: string }>;
    title: string;
    text: string;
  }[] = [
    { icon: Users, title: "Quiénes somos", text: settings?.aboutQuienesSomos || FALLBACK_TEXT.quienesSomos },
    { icon: Compass, title: "Misión", text: settings?.aboutMision || FALLBACK_TEXT.mision },
    { icon: Eye, title: "Visión", text: settings?.aboutVision || FALLBACK_TEXT.vision },
    { icon: HandHeart, title: "Valores", text: settings?.aboutValores || FALLBACK_TEXT.valores },
  ];

  const visitInfo = [
    settings?.address && {
      icon: MapPin,
      label: "Dirección",
      value: settings.city ? `${settings.address}, ${settings.city}` : settings.address,
    },
    settings?.generalSchedule && { icon: Clock, label: "Horarios", value: settings.generalSchedule },
    settings?.phone && { icon: Phone, label: "Teléfono", value: settings.phone },
    settings?.email && { icon: Mail, label: "Correo", value: settings.email },
  ].filter((item): item is { icon: typeof MapPin; label: string; value: string } => Boolean(item));

  return (
    <>
      <Breadcrumbs items={[{ label: "Conócenos" }]} />

      <section className="relative overflow-hidden bg-slate-950">
        <PlaceholderImage
          label="[FOTOGRAFÍA NEW LIFE — COMUNIDAD]"
          src={settings?.aboutImageUrl}
          tone="dark"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />

        <Container className="relative flex min-h-[45vh] flex-col items-center justify-center gap-4 py-24 text-center text-white">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            Conoce New Life
          </span>
          <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Un lugar para encontrar una nueva vida
          </h1>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading title="Quiénes somos" />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {blocks.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm shadow-slate-100"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          {visitInfo.length > 0 && (
            <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-slate-100 bg-slate-50 p-8">
              <h3 className="font-heading text-lg font-semibold text-slate-900">Visítanos</h3>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {visitInfo.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
                      <dd className="text-sm text-slate-700">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-14 flex justify-center">
            <Button href="/ministerios" variant="primary" size="lg">
              Quiero ser parte
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
