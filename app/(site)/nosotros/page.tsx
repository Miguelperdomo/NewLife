import type { Metadata } from "next";
import { Compass, Eye, HandHeart, Users } from "lucide-react";
import type { ComponentType } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { buildOpenGraphMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Conoce New Life — ${siteConfig.name}`,
  description: siteConfig.description,
  ...buildOpenGraphMetadata({
    title: `Conoce New Life — ${siteConfig.name}`,
    description: siteConfig.description,
  }),
};

const blocks: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}[] = [
  {
    icon: Users,
    title: "Quiénes somos",
    text: "[CONTENIDO TEMPORAL] New Life es una comunidad cristiana que camina junto a personas de todas las edades, ayudándolas a conocer a Dios, crecer en fe y encontrar un lugar al cual pertenecer.",
  },
  {
    icon: Compass,
    title: "Misión",
    text: "[CONTENIDO TEMPORAL] Guiar a las personas a encontrar una nueva vida en Cristo, acompañándolas en cada etapa de su crecimiento espiritual.",
  },
  {
    icon: Eye,
    title: "Visión",
    text: "[CONTENIDO TEMPORAL] Ser una iglesia relevante para cada generación, llevando esperanza dentro y fuera de nuestras puertas.",
  },
  {
    icon: HandHeart,
    title: "Valores",
    text: "[CONTENIDO TEMPORAL] Fe, comunidad, servicio, excelencia y autenticidad guían todo lo que hacemos como iglesia.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Conócenos" }]} />

      <section className="relative overflow-hidden bg-slate-950">
        <PlaceholderImage
          label="[FOTOGRAFÍA NEW LIFE — COMUNIDAD]"
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
          <SectionHeading
            title="Quiénes somos"
            description="Este contenido es temporal y será reemplazado por la información oficial de New Life."
          />

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
