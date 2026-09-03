import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { getRelatedNews } from "@/lib/content";
import { formatNewsDate, formatReadingTime } from "@/lib/news";
import type { NewsArticle } from "@/lib/types";
import { FeaturedBadge } from "./FeaturedBadge";

/**
 * Plantilla de /noticias/[slug]. A propósito NO copia la estructura de
 * EventTemplate/MinistryTemplate (sin sidebar ni botón de WhatsApp) — una
 * noticia es un artículo de lectura, no una ficha con logística.
 */
export function NewsTemplate({ article }: { article: NewsArticle }) {
  const related = getRelatedNews(article, 3);
  const paragraphs = article.content.split("\n\n");

  return (
    <>
      <Breadcrumbs items={[{ label: "Noticias", href: "/noticias" }, { label: article.title }]} />

      <section className="relative overflow-hidden bg-slate-950">
        <PlaceholderImage
          label={article.imageLabel}
          src={article.imageSrc}
          fit="contain"
          tone="dark"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />

        <Container className="relative flex min-h-[40vh] flex-col items-center justify-center gap-4 py-24 text-center text-white">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Noticias
          </Link>
          {article.featured && <FeaturedBadge />}
          <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-white/70">
            <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{formatReadingTime(article.content)}</span>
            {article.category && (
              <>
                <span aria-hidden="true">·</span>
                <span>{article.category}</span>
              </>
            )}
            {article.author && (
              <>
                <span aria-hidden="true">·</span>
                <span>{article.author}</span>
              </>
            )}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-slate-700">{article.summary}</p>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <ShareButtons title={article.title} className="mt-10 border-t border-slate-100 pt-6" />
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-24">
          <Container>
            <SectionHeading eyebrow="Noticias" title="Noticias relacionadas" align="left" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <NewsCard key={item.slug} article={item} index={index} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
