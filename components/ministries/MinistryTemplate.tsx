import Link from "next/link";
import { ArrowLeft, Clock, MapPin, MessageCircle, User, Users } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { siteConfig } from "@/data/site";
import { getUpcomingEventsByMinistry } from "@/lib/content";
import type { Ministry } from "@/lib/types";
import { buildWhatsAppLink, ministryInscriptionMessage } from "@/lib/whatsapp";

/**
 * Plantilla única reutilizada por todas las páginas /ministerios/[slug].
 * Solo cambian los datos que recibe, no la estructura.
 */
export function MinistryTemplate({ ministry }: { ministry: Ministry }) {
  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsappNumber,
    ministryInscriptionMessage(ministry.name)
  );
  const upcomingEvents = getUpcomingEventsByMinistry(ministry.slug, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950">
        <PlaceholderImage
          label={ministry.imageLabel}
          src={ministry.imageSrc}
          fit="contain"
          tone="dark"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />

        <Container className="relative flex min-h-[45vh] flex-col items-center justify-center gap-4 py-24 text-center text-white">
          <Link
            href="/ministerios"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Ministerios
          </Link>
          <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
            {ministry.name}
          </h1>
          <p className="max-w-xl text-base text-white/80">{ministry.shortDescription}</p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-slate-900">Sobre este ministerio</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{ministry.description}</p>

            {upcomingEvents.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-2xl font-bold text-slate-900">
                  Próximos eventos
                </h2>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  {upcomingEvents.map((event, index) => (
                    <EventCard key={event.slug} event={event} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 lg:sticky lg:top-24">
            <dl className="space-y-4 text-sm">
              <InfoRow icon={Users} label="Para quién" value={ministry.audience} />
              <InfoRow icon={Clock} label="Horario" value={ministry.schedule} />
              <InfoRow icon={MapPin} label="Lugar" value={ministry.location} />
              <InfoRow icon={User} label="Responsable" value={ministry.leader} />
            </dl>

            {ministry.social && ministry.social.length > 0 && (
              <div className="mt-6 flex gap-3 border-t border-slate-100 pt-6">
                {ministry.social.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-brand-600 hover:text-white"
                  >
                    <SocialIcon platform={social.platform} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}

            <Button
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="mt-6 w-full justify-center"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Quiero inscribirme
            </Button>
            <p className="mt-3 text-center text-xs text-slate-500">
              Se abre WhatsApp con un mensaje ya escrito para ti.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
      <div>
        <dt className="font-semibold text-slate-900">{label}</dt>
        <dd className="text-slate-600">{value}</dd>
      </div>
    </div>
  );
}
