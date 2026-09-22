import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventTemplate } from "@/components/events/EventTemplate";
import { siteConfig } from "@/data/site";
import { getEventBySlug, getEvents } from "@/lib/content";
import { buildOpenGraphMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata(
  props: PageProps<"/eventos/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: `Evento no encontrado — ${siteConfig.name}` };
  }

  return {
    title: `${event.name} — ${siteConfig.name}`,
    description: event.shortDescription,
    ...buildOpenGraphMetadata({
      title: event.name,
      description: event.shortDescription,
      imageSrc: event.imageSrc,
    }),
  };
}

export default async function EventPage(props: PageProps<"/eventos/[slug]">) {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventTemplate event={event} />;
}
