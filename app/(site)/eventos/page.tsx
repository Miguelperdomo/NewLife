import type { Metadata } from "next";
import { EventsView } from "@/components/events/EventsView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { siteConfig } from "@/data/site";
import { getEvents } from "@/lib/content";
import { buildOpenGraphMetadata } from "@/lib/seo";

const description = "Hay un lugar para ti. Descubre lo que estamos viviendo juntos en New Life.";

export const metadata: Metadata = {
  title: `Próximos eventos — ${siteConfig.name}`,
  description,
  ...buildOpenGraphMetadata({ title: `Próximos eventos — ${siteConfig.name}`, description }),
};

export default function EventosPage() {
  const events = getEvents();

  return (
    <>
      <Breadcrumbs items={[{ label: "Eventos" }]} />

      <section className="relative overflow-hidden bg-slate-950">
        <PlaceholderImage
          label="[FOTOGRAFÍA / COMPOSICIÓN EVENTOS NEW LIFE]"
          tone="dark"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />

        <Container className="relative flex min-h-[45vh] flex-col items-center justify-center gap-4 py-24 text-center text-white">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            Eventos
          </span>
          <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Próximos eventos
          </h1>
          <p className="max-w-xl text-base text-white/80">
            Hay un lugar para ti. Descubre lo que estamos viviendo juntos en New Life.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <EventsView events={events} />
        </Container>
      </section>
    </>
  );
}
