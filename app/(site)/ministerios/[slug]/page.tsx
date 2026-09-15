import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MinistryTemplate } from "@/components/ministries/MinistryTemplate";
import { getMinistries, getMinistryBySlug } from "@/lib/content";
import { siteConfig } from "@/data/site";
import { buildOpenGraphMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getMinistries().map((ministry) => ({ slug: ministry.slug }));
}

export async function generateMetadata(
  props: PageProps<"/ministerios/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const ministry = getMinistryBySlug(slug);

  if (!ministry) {
    return { title: `Ministerio no encontrado — ${siteConfig.name}` };
  }

  return {
    title: `${ministry.name} — ${siteConfig.name}`,
    description: ministry.shortDescription,
    ...buildOpenGraphMetadata({
      title: ministry.name,
      description: ministry.shortDescription,
      imageSrc: ministry.imageSrc,
    }),
  };
}

export default async function MinistryPage(props: PageProps<"/ministerios/[slug]">) {
  const { slug } = await props.params;
  const ministry = getMinistryBySlug(slug);

  if (!ministry) {
    notFound();
  }

  return <MinistryTemplate ministry={ministry} />;
}
