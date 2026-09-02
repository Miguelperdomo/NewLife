import type { Metadata } from "next";
import { NewsCard } from "@/components/news/NewsCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { getNews } from "@/lib/content";

export const metadata: Metadata = {
  title: `Noticias — ${siteConfig.name}`,
  description: "Mantente al día con lo que está pasando en New Life.",
};

export default function NoticiasPage() {
  const articles = getNews();

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Noticias"
          title="Noticias"
          description="Mantente al día con lo que está pasando en New Life."
        />

        {articles.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <NewsCard key={article.slug} article={article} index={index} />
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
            Todavía no hay noticias publicadas.
          </p>
        )}
      </Container>
    </section>
  );
}
