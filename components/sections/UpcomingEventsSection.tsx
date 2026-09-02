import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getUpcomingEvents } from "@/lib/content";

export function UpcomingEventsSection() {
  const events = getUpcomingEvents(3);

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Eventos"
          title="Próximos eventos"
          description="Hay un lugar para ti. Descubre lo que estamos viviendo juntos en New Life."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <EventCard key={event.slug} event={event} index={index} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button href="/eventos" variant="ghost">
            Ver todos los eventos
          </Button>
        </div>
      </Container>
    </section>
  );
}
