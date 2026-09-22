import Link from "next/link";
import { ArrowLeft, Clock, MapPin, MessageCircle, Navigation, Star } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { getPastorBySlug } from "@/lib/content";
import { formatEventTime } from "@/lib/events";
import { googleMapsDirectionsUrl, googleMapsEmbedUrl, googleMapsSearchUrl } from "@/lib/maps";
import { dayOfWeekLabel } from "@/lib/schedule";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import type { Campus } from "@/lib/types";
import { buildWhatsAppLink, campusInquiryMessage } from "@/lib/whatsapp";

/**
 * Plantilla única reutilizada por todas las páginas /sedes/[slug]. Análoga a
 * EventTemplate/MinistryTemplate: solo cambian los datos, no la estructura.
 */
export async function CampusTemplate({ campus }: { campus: Campus }) {
  const services = campus.schedules ?? [];
  const pastor = campus.leadPastorSlug ? await getPastorBySlug(campus.leadPastorSlug) : undefined;
  const settings = await getPublicSiteSettings();
  const whatsappHref = buildWhatsAppLink(
    campus.whatsappNumber ?? settings?.whatsappNumber ?? siteConfig.whatsappNumber,
    campusInquiryMessage(campus.fullName)
  );

  return (
    <>
      <Breadcrumbs items={[{ label: "Sedes", href: "/sedes" }, { label: campus.fullName }]} />

      <section className="relative overflow-hidden bg-slate-950">
        <PlaceholderImage
          label={campus.imageLabel}
          src={campus.imageSrc}
          fit="contain"
          tone="dark"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />

        <Container className="relative flex min-h-[40vh] flex-col items-center justify-center gap-4 py-24 text-center text-white">
          <Link
            href="/sedes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Sedes
          </Link>
          {campus.isMain && (
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-400">
              Sede principal
            </span>
          )}
          <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
            {campus.fullName}
          </h1>
          <p className="flex items-center gap-2 text-base text-white/80">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {campus.address}
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900">Horarios de servicio</h2>
              {services.length > 0 ? (
                <div className="mt-4 space-y-2.5">
                  {services.map((service, index) => (
                    <div
                      key={`${service.dayOfWeek}-${service.time}-${index}`}
                      className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {dayOfWeekLabel(service.dayOfWeek)} · {formatEventTime(service.time)} — {service.title}
                        </p>
                        {service.description && <p className="text-sm text-slate-500">{service.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  Todavía no hay horarios fijos configurados para esta sede — escríbenos por WhatsApp y te
                  contamos los horarios vigentes.
                </p>
              )}
            </div>

            {campus.gallery && campus.gallery.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900">Galería de instalaciones</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {campus.gallery.map((photo, index) => (
                    <PlaceholderImage
                      key={`${photo.label}-${index}`}
                      label={photo.label}
                      src={photo.src}
                      tone={index % 2 === 0 ? "brand" : "accent"}
                      className="aspect-square w-full rounded-2xl"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 lg:sticky lg:top-24">
            {pastor && (
              <Link
                href={`/pastores/${pastor.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-brand-200 hover:bg-white"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                  <PlaceholderImage
                    label={pastor.imageLabel}
                    src={pastor.imageSrc}
                    tone="dark"
                    className="h-full w-full"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Pastor/líder de esta sede
                  </p>
                  <p className="truncate font-heading text-sm font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
                    {pastor.name}
                  </p>
                </div>
              </Link>
            )}

            <div className="space-y-3">
              <Button
                href={googleMapsDirectionsUrl(campus.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="w-full justify-center"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Cómo llegar
              </Button>
              <Button
                href={googleMapsSearchUrl(`${campus.fullName} ${campus.address}`)}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                className="w-full justify-center border border-slate-200"
              >
                <Star className="h-4 w-4" aria-hidden="true" />
                Ver en Google Maps
              </Button>
              <Button
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="w-full justify-center"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Contactar esta sede
              </Button>
            </div>
          </aside>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Ubicación" title="Cómo encontrarnos" align="left" />
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-100 shadow-sm shadow-slate-100">
            <iframe
              src={googleMapsEmbedUrl(campus.mapQuery)}
              title={`Mapa de ${campus.fullName}`}
              className="h-80 w-full sm:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
