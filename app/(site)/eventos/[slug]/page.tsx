import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventTemplate } from "@/components/events/EventTemplate";
import { siteConfig } from "@/data/site";
import { getEventBySlug, getEvents } from "@/lib/content";

export function generateStaticParams() {
  return getEvents().map((event) => ({ slug: event.slug }));
}

export async function generateMetadata(
  props: PageProps<"/eventos/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const event = getEventBySlug(slug);

  if (!event) {
    return { title: `Evento no encontrado — ${siteConfig.name}` };
  }

  return {
    title: `${event.name} — ${siteConfig.name}`,
    description: event.shortDescription,
  };
}

export default async function EventPage(props: PageProps<"/eventos/[slug]">) {
  const { slug } = await props.params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventTemplate event={event} />;
}
