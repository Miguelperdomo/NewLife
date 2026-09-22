import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MinistryTemplate } from "@/components/ministries/MinistryTemplate";
import { getCampuses, getMinistries, getMinistryBySlug } from "@/lib/content";
import { siteConfig } from "@/data/site";
import { getUpcomingEventsByMinistry } from "@/lib/eventsContent";
import { buildOpenGraphMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

export async function generateStaticParams() {
  const ministries = await getMinistries();
  return ministries.map((ministry) => ({ slug: ministry.slug }));
}

export async function generateMetadata(
  props: PageProps<"/ministerios/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const ministry = await getMinistryBySlug(slug);

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
  const [ministry, ministries, campuses, settings, upcomingEvents] = await Promise.all([
    getMinistryBySlug(slug),
    getMinistries(),
    getCampuses(),
    getPublicSiteSettings(),
    getUpcomingEventsByMinistry(slug, 3),
  ]);

  if (!ministry) {
    notFound();
  }

  return (
    <MinistryTemplate
      ministry={ministry}
      ministries={ministries}
      campuses={campuses}
      upcomingEvents={upcomingEvents}
      whatsappNumber={settings?.whatsappNumber}
    />
  );
}
