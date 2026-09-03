import { CampusCard } from "@/components/campuses/CampusCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCampuses } from "@/lib/content";

export function CampusesPreviewSection() {
  const campuses = getCampuses();

  if (campuses.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Sedes"
          title="Encuentra la sede más cercana"
          description="Estamos en varios puntos de la ciudad — elige el que te quede más cerca y ven a visitarnos."
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
      </Container>
    </section>
  );
}
