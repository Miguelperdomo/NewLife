import { CampusCard } from "@/components/campuses/CampusCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCampuses } from "@/lib/content";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

export async function CampusesPreviewSection() {
  const [campuses, settings] = await Promise.all([getCampuses(), getPublicSiteSettings()]);

  if (campuses.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 bg-dot-texture py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow={settings?.campusesEyebrow || "Sedes"}
            title={settings?.campusesTitle || "Encuentra la sede más cercana"}
            description={
              settings?.campusesDescription ||
              "Estamos en varios puntos de la ciudad — elige el que te quede más cerca y ven a visitarnos."
            }
          />

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {campuses.map((campus, index) => (
              <CampusCard key={campus.slug} campus={campus} tone={index % 2 === 0 ? "brand" : "accent"} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button href="/sedes" variant="ghost">
              Ver todas las sedes
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
