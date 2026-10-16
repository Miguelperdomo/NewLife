import type { Metadata } from "next";
import { PastorPyramid } from "@/components/pastors/PastorPyramid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { getPastors } from "@/lib/content";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import { buildOpenGraphMetadata } from "@/lib/seo";

const description = "Conoce a nuestro Apóstol Fundador.";

export const metadata: Metadata = {
  title: `Apóstol — ${siteConfig.name}`,
  description,
  ...buildOpenGraphMetadata({ title: `Apóstol — ${siteConfig.name}`, description }),
};

export default async function PastoresPage() {
  const [pastors, settings] = await Promise.all([getPastors(), getPublicSiteSettings()]);

  return (
    <>
      <Breadcrumbs items={[{ label: "Apóstol" }]} />

      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
        </div>

        <Container className="relative">
          <SectionHeading
            eyebrow={settings?.pastorsEyebrow || "Liderazgo"}
            title={settings?.pastorsTitle || "Conoce a nuestro Apóstol"}
            description={
              settings?.pastorsDescription ||
              "Llamado a pastorear, servir y caminar junto a la comunidad de New Life."
            }
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
