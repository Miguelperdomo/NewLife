import Link from "next/link";
import { ArrowLeft, Clock, MapPin, MessageCircle, Tag } from "lucide-react";
import type { ReactNode } from "react";
import { EventBadge } from "@/components/events/EventBadge";
import { EventCard } from "@/components/events/EventCard";
import { MinistryIcon } from "@/components/ministries/ministryIcons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { siteConfig } from "@/data/site";
import { getCampuses, getCampusBySlug, getMinistries, getMinistryBySlug, getRelatedEvents } from "@/lib/content";
import { formatEventDate, getEventStatus } from "@/lib/events";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import type { ChurchEvent } from "@/lib/types";
import { buildWhatsAppLink, eventInscriptionMessage } from "@/lib/whatsapp";

/**
 * Plantilla única reutilizada por todas las páginas /eventos/[slug].
 * Análoga a MinistryTemplate: solo cambian los datos, no la estructura.
 */
export async function EventTemplate({ event }: { event: ChurchEvent }) {
  const status = getEventStatus(event.date, event.endDate);
  const [campus, ministry, ministries, campuses, settings] = await Promise.all([
    event.campus ? getCampusBySlug(event.campus) : Promise.resolve(undefined),
    event.ministry ? getMinistryBySlug(event.ministry) : Promise.resolve(undefined),
    getMinistries(),
    getCampuses(),
    getPublicSiteSettings(),
  ]);
  const ministryLabel = ministry?.name ?? "General";
  const place = [campus?.name, event.location].filter(Boolean).join(" — ");

  const related = await getRelatedEvents(event, 3);
  const canRegister = status !== "finalizado" && event.registrationByWhatsApp !== false;
  const whatsappHref = buildWhatsAppLink(
    settings?.whatsappNumber ?? siteConfig.whatsappNumber,
    eventInscriptionMessage(event.name, ministry?.name)
  );

  const iconClass = "mt-0.5 h-4 w-4 shrink-0 text-brand-600";
  const infoRows: InfoRowData[] = [
    {
      key: "date",
      icon: <Clock className={iconClass} aria-hidden="true" />,
      label: "Fecha y hora",
      value: event.time
        ? `${formatEventDate(event.date, event.endDate)} · ${event.time}`
        : formatEventDate(event.date, event.endDate),
    },
  ];
  if (place) {
    infoRows.push({
      key: "place",
      icon: <MapPin className={iconClass} aria-hidden="true" />,
      label: "Lugar",
      value: place,
    });
  }
  infoRows.push({
    key: "ministry",
    icon: <MinistryIcon slug={event.ministry ?? "general"} className={iconClass} />,
    label: "Ministerio organizador",
    value: ministryLabel,
  });
  if (event.category) {
    infoRows.push({
      key: "category",
      icon: <Tag className={iconClass} aria-hidden="true" />,
      label: "Categoría",
      value: event.category,
    });
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Eventos", href: "/eventos" }, { label: event.name }]} />

      <section className="relative overflow-hidden bg-slate-950">
        <PlaceholderImage
          label={event.imageLabel}
          src={event.imageSrc}
          fit="contain"
          tone="dark"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />

        <Container className="relative flex min-h-[45vh] flex-col items-center justify-center gap-4 py-24 text-center text-white">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Eventos
          </Link>
          <EventBadge status={status} />
          <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
            {event.name}
          </h1>
          <p className="max-w-xl text-base text-white/80">{event.shortDescription}</p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-slate-900">Sobre este evento</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{event.description}</p>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 lg:sticky lg:top-24">
            <dl className="space-y-4 text-sm">
              {infoRows.map((row) => (
                <InfoRow key={row.key} icon={row.icon} label={row.label}>
                  {row.value}
                </InfoRow>
              ))}
            </dl>

            {canRegister ? (
              <>
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
              </>
            ) : (
              <p className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center text-sm text-slate-500">
                {status === "finalizado"
                  ? "Este evento ya finalizó."
                  : "Este evento no requiere inscripción previa."}
              </p>
            )}

            <ShareButtons title={event.name} className="mt-6 border-t border-slate-100 pt-4" />
          </aside>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-24">
          <Container>
            <SectionHeading eyebrow="Eventos" title="Eventos relacionados" align="left" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <EventCard
                  key={item.slug}
                  event={item}
                  ministries={ministries}
                  campuses={campuses}
                  index={index}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <dt className="font-semibold text-slate-900">{label}</dt>
        <dd className="text-slate-600">{children}</dd>
      </div>
    </div>
  );
}

interface InfoRowData {
  key: string;
  icon: ReactNode;
  label: string;
  value: string;
}
