import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MinistryCard } from "@/components/ministries/MinistryCard";
import { getMinistries } from "@/lib/content";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Ministerios — ${siteConfig.name}`,
  description: "Encuentra tu lugar en uno de los ministerios de New Life.",
};

export default function MinisteriosPage() {
  const ministries = getMinistries();

  return (
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
  );
}
