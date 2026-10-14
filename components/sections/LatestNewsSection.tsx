import { NewsCard } from "@/components/news/NewsCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getNews } from "@/lib/content";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

export async function LatestNewsSection() {
  const [articles, settings] = await Promise.all([getNews(3), getPublicSiteSettings()]);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow={settings?.newsEyebrow || "Noticias"}
            title={settings?.newsTitle || "Últimas noticias"}
            description={settings?.newsDescription || "Mantente al día con lo que está pasando en New Life."}
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
        </ScrollReveal>
      </Container>
    </section>
  );
}
