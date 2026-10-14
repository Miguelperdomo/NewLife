import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { NewsList } from "@/components/news/NewsList";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { getNews } from "@/lib/content";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import { buildOpenGraphMetadata } from "@/lib/seo";

const description = "Mantente al día con lo que está pasando en New Life.";

export const metadata: Metadata = {
  title: `Noticias — ${siteConfig.name}`,
  description,
  ...buildOpenGraphMetadata({ title: `Noticias — ${siteConfig.name}`, description }),
};

export default async function NoticiasPage() {
  const [articles, settings] = await Promise.all([getNews(), getPublicSiteSettings()]);

  return (
    <>
      <Breadcrumbs items={[{ label: "Noticias" }]} />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow={settings?.newsEyebrow || "Noticias"}
            title={settings?.newsTitle || "Noticias"}
            description={settings?.newsDescription || "Mantente al día con lo que está pasando en New Life."}
          />

          {articles.length > 0 ? (
            <div className="mt-12">
              <NewsList articles={articles} />
            </div>
          ) : (
            <EmptyState
              icon={Newspaper}
              title="Todavía no hay noticias publicadas."
              description="Vuelve pronto — aquí aparecerán las últimas novedades de New Life."
              className="mt-12"
            />
          )}
        </Container>
      </section>
    </>
  );
}
