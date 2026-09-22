import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCampuses, getMinistries, getUpcomingEvents } from "@/lib/content";

export async function UpcomingEventsSection() {
  const [events, ministries, campuses] = await Promise.all([
    getUpcomingEvents(3),
    getMinistries(),
    getCampuses(),
  ]);

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
            <EventCard key={event.slug} event={event} ministries={ministries} campuses={campuses} index={index} />
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
