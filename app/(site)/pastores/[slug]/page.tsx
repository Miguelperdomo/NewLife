import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PastorTemplate } from "@/components/pastors/PastorTemplate";
import { siteConfig } from "@/data/site";
import { getPastorBySlug, getPastors } from "@/lib/content";
import { buildOpenGraphMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const pastors = await getPastors();
  return pastors.map((pastor) => ({ slug: pastor.slug }));
}

export async function generateMetadata(
  props: PageProps<"/pastores/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const pastor = await getPastorBySlug(slug);

  if (!pastor) {
    return { title: `Pastor no encontrado — ${siteConfig.name}` };
  }

  return {
    title: `${pastor.name} — ${siteConfig.name}`,
    description: pastor.bio,
    ...buildOpenGraphMetadata({
      title: pastor.name,
      description: pastor.bio,
      imageSrc: pastor.imageSrc,
    }),
  };
}

export default async function PastorPage(props: PageProps<"/pastores/[slug]">) {
  const { slug } = await props.params;
  const pastor = await getPastorBySlug(slug);

  if (!pastor) {
    notFound();
  }

  return <PastorTemplate pastor={pastor} />;
}
