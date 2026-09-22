import type { Metadata } from "next";
import { CampusCard } from "@/components/campuses/CampusCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { getCampuses } from "@/lib/content";
import { buildOpenGraphMetadata } from "@/lib/seo";

const description = "Encuentra la sede de New Life más cercana a ti.";

export const metadata: Metadata = {
  title: `Sedes — ${siteConfig.name}`,
  description,
  ...buildOpenGraphMetadata({ title: `Sedes — ${siteConfig.name}`, description }),
};

const tones = ["dark", "brand"] as const;

export default async function SedesPage() {
  const campuses = await getCampuses();

  return (
    <>
      <Breadcrumbs items={[{ label: "Sedes" }]} />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Sedes"
            title="Visítanos en cualquiera de nuestras sedes"
            description="Toca “Cómo llegar” para abrir la ruta en Google Maps, o revisa la ficha del lugar para ver reseñas."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {campuses.map((campus, index) => (
              <CampusCard key={campus.slug} campus={campus} tone={tones[index % tones.length]} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
