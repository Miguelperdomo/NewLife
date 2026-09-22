import type { Metadata } from "next";
import { NewsList } from "@/components/news/NewsList";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { getNews } from "@/lib/content";
import { buildOpenGraphMetadata } from "@/lib/seo";

const description = "Mantente al día con lo que está pasando en New Life.";

export const metadata: Metadata = {
  title: `Noticias — ${siteConfig.name}`,
  description,
  ...buildOpenGraphMetadata({ title: `Noticias — ${siteConfig.name}`, description }),
};

export default async function NoticiasPage() {
  const articles = await getNews();

  return (
    <>
      <Breadcrumbs items={[{ label: "Noticias" }]} />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Noticias"
            title="Noticias"
            description="Mantente al día con lo que está pasando en New Life."
          />

          {articles.length > 0 ? (
            <div className="mt-12">
              <NewsList articles={articles} />
            </div>
          ) : (
            <p className="mt-12 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
              Todavía no hay noticias publicadas.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
