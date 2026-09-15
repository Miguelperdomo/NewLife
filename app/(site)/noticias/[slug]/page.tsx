import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsTemplate } from "@/components/news/NewsTemplate";
import { siteConfig } from "@/data/site";
import { getNews, getNewsBySlug } from "@/lib/content";
import { buildOpenGraphMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getNews().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/noticias/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getNewsBySlug(slug);

  if (!article) {
    return { title: `Noticia no encontrada — ${siteConfig.name}` };
  }

  return {
    title: `${article.title} — ${siteConfig.name}`,
    description: article.summary,
    ...buildOpenGraphMetadata({
      title: article.title,
      description: article.summary,
      imageSrc: article.imageSrc,
      type: "article",
    }),
  };
}

export default async function NewsPage(props: PageProps<"/noticias/[slug]">) {
  const { slug } = await props.params;
  const article = getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return <NewsTemplate article={article} />;
}
