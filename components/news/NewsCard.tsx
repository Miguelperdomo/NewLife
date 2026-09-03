import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { formatNewsDate, formatReadingTime } from "@/lib/news";
import type { NewsArticle } from "@/lib/types";
import { FeaturedBadge } from "./FeaturedBadge";

const tones = ["brand", "accent", "dark"] as const;

export function NewsCard({ article, index = 0 }: { article: NewsArticle; index?: number }) {
  const tone = tones[index % tones.length];

  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-100 transition-transform hover:-translate-y-1"
    >
      <div className="relative">
        <PlaceholderImage
          label={article.imageLabel}
          src={article.imageSrc}
          tone={tone}
          className="aspect-[4/3] w-full"
        />
        {article.featured && (
          <FeaturedBadge className="absolute left-3 top-3 bg-white/90 backdrop-blur" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
          <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
          {article.category && (
            <>
              <span aria-hidden="true">·</span>
              <span>{article.category}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{formatReadingTime(article.content)}</span>
        </div>
        <h3 className="mt-2 font-heading text-lg font-semibold text-slate-900">{article.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{article.summary}</p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
          Leer noticia
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
