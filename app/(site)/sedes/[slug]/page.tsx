import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampusTemplate } from "@/components/campuses/CampusTemplate";
import { siteConfig } from "@/data/site";
import { getCampusBySlug, getCampuses } from "@/lib/content";
import { buildOpenGraphMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getCampuses().map((campus) => ({ slug: campus.slug }));
}

export async function generateMetadata(
  props: PageProps<"/sedes/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const campus = getCampusBySlug(slug);

  if (!campus) {
    return { title: `Sede no encontrada — ${siteConfig.name}` };
  }

  return {
    title: `${campus.fullName} — ${siteConfig.name}`,
    description: campus.address,
    ...buildOpenGraphMetadata({
      title: campus.fullName,
      description: campus.address,
      imageSrc: campus.imageSrc,
    }),
  };
}

export default async function CampusPage(props: PageProps<"/sedes/[slug]">) {
  const { slug } = await props.params;
  const campus = getCampusBySlug(slug);

  if (!campus) {
    notFound();
  }

  return <CampusTemplate campus={campus} />;
}
