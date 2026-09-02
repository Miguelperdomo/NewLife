import { NewsCard } from "@/components/news/NewsCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getNews } from "@/lib/content";

export function LatestNewsSection() {
  const articles = getNews(3);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Noticias"
          title="Últimas noticias"
          description="Mantente al día con lo que está pasando en New Life."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <NewsCard key={article.slug} article={article} index={index} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button href="/noticias" variant="ghost">
            Ver todas las noticias
          </Button>
        </div>
      </Container>
    </section>
  );
}
