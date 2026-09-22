import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MinistryCard } from "@/components/ministries/MinistryCard";
import { getMinistries } from "@/lib/content";
import { siteConfig } from "@/data/site";
import { buildOpenGraphMetadata } from "@/lib/seo";

const description = "Encuentra tu lugar en uno de los ministerios de New Life.";

export const metadata: Metadata = {
  title: `Ministerios — ${siteConfig.name}`,
  description,
  ...buildOpenGraphMetadata({ title: `Ministerios — ${siteConfig.name}`, description }),
};

export default async function MinisteriosPage() {
  const ministries = await getMinistries();

  return (
    <>
      <Breadcrumbs items={[{ label: "Ministerios" }]} />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Ministerios"
            title="Encuentra tu lugar"
            description="Sea cual sea tu edad o etapa de vida, hay un equipo esperándote en New Life."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.map((ministry, index) => (
              <MinistryCard key={ministry.slug} ministry={ministry} index={index} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
