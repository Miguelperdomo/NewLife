import Link from "next/link";
import { ArrowLeft, Clock, MapPin, MessageCircle, Navigation, Star } from "lucide-react";
import { CampusJsonLd } from "@/components/campuses/CampusJsonLd";
import { VisitCheckinWidget } from "@/components/sections/VisitCheckinWidget";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/site";
import { activeCampusAmenities } from "@/lib/campusAmenities";
import { getCampuses, getMinistries, getPastorBySlug } from "@/lib/content";
import { formatEventTime } from "@/lib/events";
import { googleMapsDirectionsUrl, googleMapsEmbedUrl, googleMapsSearchUrl } from "@/lib/maps";
import { dayOfWeekLabel, findNextService } from "@/lib/schedule";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import type { Campus, ServiceSchedule } from "@/lib/types";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink, campusInquiryMessage } from "@/lib/whatsapp";

function scheduleKey(service: ServiceSchedule): string {
  return `${service.dayOfWeek}-${service.time}-${service.title}`;
}

/** Agrupa los horarios por día (domingo -> sábado) y los ordena por hora dentro de cada día — en vez de la lista plana de siempre. */
function groupServicesByDay(services: ServiceSchedule[]): [number, ServiceSchedule[]][] {
  const groups = new Map<number, ServiceSchedule[]>();
  for (const service of services) {
    if (!groups.has(service.dayOfWeek)) groups.set(service.dayOfWeek, []);
    groups.get(service.dayOfWeek)!.push(service);
  }
  for (const group of groups.values()) {
    group.sort((a, b) => a.time.localeCompare(b.time));
  }
  return [...groups.entries()].sort(([a], [b]) => a - b);
}

/**
 * Plantilla única reutilizada por todas las páginas /sedes/[slug]. Análoga a
 * EventTemplate/MinistryTemplate: solo cambian los datos, no la estructura.
 */
export async function CampusTemplate({ campus }: { campus: Campus }) {
  const services = campus.schedules ?? [];
  const [pastor, settings, ministries, allCampuses] = await Promise.all([
    campus.leadPastorSlug ? getPastorBySlug(campus.leadPastorSlug) : Promise.resolve(undefined),
    getPublicSiteSettings(),
    getMinistries(),
    getCampuses(),
  ]);
  const whatsappHref = buildWhatsAppLink(
    campus.whatsappNumber ?? settings?.whatsappNumber ?? siteConfig.whatsappNumber,
    campusInquiryMessage(campus.fullName)
  );
  const groupedServices = groupServicesByDay(services);
  const nextService = findNextService(services, new Date());
  const nextServiceKey = nextService ? scheduleKey(nextService) : undefined;
  const activeAmenities = activeCampusAmenities(campus);
  // La sede actual va primero — así "Avísanos que vienes" arranca con esta ya seleccionada.
  const checkinCampuses = [campus, ...allCampuses.filter((item) => item.slug !== campus.slug)].map((item) => ({
    slug: item.slug,
    name: item.name,
    city: item.city,
  }));

  return (
    <>
      <CampusJsonLd campus={campus} />
      <Breadcrumbs items={[{ label: "Campus", href: "/sedes" }, { label: campus.fullName }]} />

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
            Campus
          </Link>
          {campus.isMain && (
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-400">
              Campus principal
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
            {activeAmenities.length > 0 && (
              <RevealOnScroll>
                <div className="flex flex-wrap gap-4">
                  {activeAmenities.map((amenity) => (
                    <div
                      key={amenity.key}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70"
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${amenity.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                      >
                        <amenity.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-semibold text-slate-700">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            )}

            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900">Horarios de servicio</h2>
              {groupedServices.length > 0 ? (
                <div className="mt-4 space-y-6">
                  {groupedServices.map(([dayOfWeek, group]) => (
                    <div key={dayOfWeek}>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
                        {dayOfWeekLabel(dayOfWeek)}
                      </p>
                      <div className="mt-2.5 space-y-2.5">
                        {group.map((service) => {
                          const isNext = scheduleKey(service) === nextServiceKey;
                          const ministry = service.ministrySlug
                            ? ministries.find((item) => item.slug === service.ministrySlug)
                            : undefined;
                          const row = (
                            <div
                              className={cn(
                                "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
                                isNext ? "border-brand-200 bg-brand-50" : "border-slate-100 bg-slate-50",
                                ministry && "hover:border-brand-300 hover:bg-white"
                              )}
                            >
                              <Clock
                                className={cn("mt-0.5 h-4 w-4 shrink-0", isNext ? "text-brand-600" : "text-slate-400")}
                                aria-hidden="true"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-slate-900">
                                    {formatEventTime(service.time)} — {service.title}
                                  </p>
                                  {isNext && (
                                    <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                      Próximo
                                    </span>
                                  )}
                                </div>
                                {service.description && (
                                  <p className="text-sm text-slate-500">{service.description}</p>
                                )}
                                {ministry && (
                                  <p className="mt-0.5 text-xs font-semibold text-brand-600">
                                    Ministerio {ministry.name} →
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                          return ministry ? (
                            <Link key={scheduleKey(service)} href={`/ministerios/${ministry.slug}`} className="block">
                              {row}
                            </Link>
                          ) : (
                            <div key={scheduleKey(service)}>{row}</div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  Todavía no hay horarios fijos configurados para este campus — escríbenos por WhatsApp y te
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
                    Pastor/líder de este campus
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
                Contactar este campus
              </Button>
              <div className="[&>button]:w-full [&>button]:justify-center">
                <VisitCheckinWidget campuses={checkinCampuses} />
              </div>
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
