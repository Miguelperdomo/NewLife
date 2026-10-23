import type { Metadata } from "next";
import { AllCampusesMap } from "@/components/campuses/AllCampusesMap";
import { CampusCard } from "@/components/campuses/CampusCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { getCampuses } from "@/lib/content";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import { buildOpenGraphMetadata } from "@/lib/seo";

const description = "Encuentra el campus de New Life más cercano a ti.";

export const metadata: Metadata = {
  title: `Campus — ${siteConfig.name}`,
  description,
  ...buildOpenGraphMetadata({ title: `Campus — ${siteConfig.name}`, description }),
};

const tones = ["dark", "brand"] as const;

export default async function SedesPage() {
  const [campuses, settings] = await Promise.all([getCampuses(), getPublicSiteSettings()]);

  return (
    <>
      <Breadcrumbs items={[{ label: "Campus" }]} />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow={settings?.campusesEyebrow || "Campus"}
            title={settings?.campusesTitle || "Visítanos en cualquiera de nuestros campus"}
            description={
              settings?.campusesDescription ||
              "Toca “Cómo llegar” para abrir la ruta en Google Maps, o revisa la ficha del lugar para ver reseñas."
            }
          />

          <div className="mt-12">
            <AllCampusesMap campuses={campuses} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {campuses.map((campus, index) => (
              <CampusCard key={campus.slug} campus={campus} tone={tones[index % tones.length]} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
