import { Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/LogoMark";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { EventAttendanceForm } from "@/components/events/EventAttendanceForm";

// a diferencia del banner "en vivo" (foto a un lado), acá la foto ocupa todo
// el banner, como un afiche real
export function EventAnnouncementBanner({
  eventName,
  shortDescription,
  time,
  locationLabel,
  directionsHref,
  imageSrc,
  imageLabel,
  logoUrl,
  logoAlt,
  campuses,
  whatsappNumber,
  registrationUrl,
}: {
  eventName: string;
  shortDescription: string;
  time?: string;
  locationLabel?: string;
  directionsHref: string;
  imageSrc?: string;
  imageLabel: string;
  logoUrl?: string;
  logoAlt: string;
  campuses: { slug: string; name: string }[];
  whatsappNumber: string;
  /** link propio de inscripción (Google Forms, etc.) — si existe, "Inscribirme" manda ahí en vez de WhatsApp */
  registrationUrl?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[60vh] items-end overflow-hidden border-b border-white/10 bg-slate-950 sm:min-h-[85vh] lg:min-h-[90vh]">
      <PlaceholderImage label={imageLabel} src={imageSrc} tone="dark" fit="contain" className="absolute inset-0 h-full w-full" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/10"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/10 to-transparent" />

      <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm sm:left-8 sm:top-8">
        <LogoMark className="h-full w-full rounded-full" src={logoUrl} alt={logoAlt} />
      </span>

      <Container className="relative w-full py-10 sm:py-10 lg:py-12">
        <span className="inline-flex items-center rounded-full bg-accent-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-950">
          Evento destacado
        </span>

        <h1 className="mt-4 max-w-2xl font-heading text-2xl font-bold leading-[1.05] text-white sm:text-3xl md:text-4xl">
          {eventName}
        </h1>

        <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">{shortDescription}</p>

        {(time || locationLabel) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/90">
            {time && (
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent-400" aria-hidden="true" />
                {time}
              </span>
            )}
            {locationLabel && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent-400" aria-hidden="true" />
                {locationLabel}
              </span>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <MagneticButton>
            {registrationUrl ? (
              <Button href={registrationUrl} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
                Inscribirme
              </Button>
            ) : (
              <EventAttendanceForm
                eventName={eventName}
                defaultCampus={locationLabel}
                campuses={campuses}
                whatsappNumber={whatsappNumber}
                label="Inscribirme"
              />
            )}
          </MagneticButton>
          <MagneticButton>
            <Button href={directionsHref} variant="outline" size="lg">
              Cómo llegar
            </Button>
          </MagneticButton>
        </div>
      </Container>
    </section>
  );
}
