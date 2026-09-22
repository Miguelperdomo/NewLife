import type { Metadata } from "next";
import { PastorPyramid } from "@/components/pastors/PastorPyramid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { getPastors } from "@/lib/content";
import { buildOpenGraphMetadata } from "@/lib/seo";

const description = "Conoce al equipo de liderazgo de New Life.";

export const metadata: Metadata = {
  title: `Pastores — ${siteConfig.name}`,
  description,
  ...buildOpenGraphMetadata({ title: `Pastores — ${siteConfig.name}`, description }),
};

export default async function PastoresPage() {
  const pastors = await getPastors();

  return (
    <>
      <Breadcrumbs items={[{ label: "Pastores" }]} />

      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
        </div>

        <Container className="relative">
          <SectionHeading
            eyebrow="Liderazgo"
            title="Nuestros Pastores"
            description="Un equipo llamado a guiar, servir y caminar junto a la comunidad de New Life."
            tone="dark"
          />

          <div className="mt-16">
            <PastorPyramid pastors={pastors} />
          </div>
        </Container>
      </section>
    </>
  );
}
