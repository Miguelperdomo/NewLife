import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCampuses, getMinistries, getUpcomingEvents } from "@/lib/content";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

export async function UpcomingEventsSection() {
  const [events, ministries, campuses, settings] = await Promise.all([
    getUpcomingEvents(3),
    getMinistries(),
    getCampuses(),
    getPublicSiteSettings(),
  ]);

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow={settings?.eventsEyebrow || "Eventos"}
            title={settings?.eventsTitle || "Próximos eventos"}
            description={
              settings?.eventsDescription ||
              "Hay un lugar para ti. Descubre lo que estamos viviendo juntos en New Life."
            }
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
        </ScrollReveal>
      </Container>
    </section>
  );
}
