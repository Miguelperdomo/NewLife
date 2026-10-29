import { Compass, Eye, HandHeart, Users } from "lucide-react";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

const FALLBACK_TEXT = {
  quienesSomos:
    "[CONTENIDO TEMPORAL] Somos una comunidad de personas que buscan conocer a Dios y vivir la fe de manera real, cercana y en comunidad.",
  mision: "[CONTENIDO TEMPORAL] Guiar a las personas a encontrar una nueva vida en Cristo y acompañarlas en su crecimiento espiritual.",
  vision: "[CONTENIDO TEMPORAL] Ser una iglesia relevante para cada generación, llevando esperanza dentro y fuera de nuestras puertas.",
  valores: "[CONTENIDO TEMPORAL] Fe, comunidad, servicio, excelencia y autenticidad guían todo lo que hacemos.",
};

// usa el mismo contenido de Configuración que /nosotros, así que editarlo
// ahí actualiza las dos páginas a la vez
export async function AboutSection() {
  const settings = await getPublicSiteSettings();

  const cards: {
    icon: ComponentType<{ className?: string }>;
    title: string;
    text: string;
  }[] = [
    { icon: Users, title: "Quiénes somos", text: settings?.aboutQuienesSomos || FALLBACK_TEXT.quienesSomos },
    { icon: Compass, title: "Misión", text: settings?.aboutMision || FALLBACK_TEXT.mision },
    { icon: Eye, title: "Visión", text: settings?.aboutVision || FALLBACK_TEXT.vision },
    { icon: HandHeart, title: "Valores", text: settings?.aboutValores || FALLBACK_TEXT.valores },
  ];

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <SectionHeading eyebrow="Conoce New Life" title="Una comunidad que camina contigo" />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button href="/nosotros" variant="ghost">
              Conoce más
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
