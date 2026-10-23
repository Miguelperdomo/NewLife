import type { Metadata } from "next";
import { Clock, Compass, Eye, HandHeart, Mail, MapPin, MessageCircle, Navigation, Phone, Users } from "lucide-react";
import type { ComponentType } from "react";
import { AllCampusesMap } from "@/components/campuses/AllCampusesMap";
import { VisitCheckinWidget } from "@/components/sections/VisitCheckinWidget";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { siteConfig, socialLinks } from "@/data/site";
import { activeCampusAmenities } from "@/lib/campusAmenities";
import { getCampuses } from "@/lib/content";
import { formatEventTime } from "@/lib/events";
import { googleMapsDirectionsUrl } from "@/lib/maps";
import { getPastors } from "@/lib/pastors";
import { buildOpenGraphMetadata } from "@/lib/seo";
import { dayOfWeekLabel, findNextService } from "@/lib/schedule";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import type { SocialLink } from "@/lib/types";
import { buildWhatsAppLink, campusInquiryMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: `Conoce New Life — ${siteConfig.name}`,
  description: siteConfig.description,
  ...buildOpenGraphMetadata({
    title: `Conoce New Life — ${siteConfig.name}`,
    description: siteConfig.description,
  }),
};

const FALLBACK_TEXT: Record<"quienesSomos" | "mision" | "vision" | "valores", string> = {
  quienesSomos:
    "[CONTENIDO TEMPORAL] New Life es una comunidad cristiana que camina junto a personas de todas las edades, ayudándolas a conocer a Dios, crecer en fe y encontrar un lugar al cual pertenecer.",
  mision:
    "[CONTENIDO TEMPORAL] Guiar a las personas a encontrar una nueva vida en Cristo, acompañándolas en cada etapa de su crecimiento espiritual.",
  vision: "[CONTENIDO TEMPORAL] Ser una iglesia relevante para cada generación, llevando esperanza dentro y fuera de nuestras puertas.",
  valores: "[CONTENIDO TEMPORAL] Fe, comunidad, servicio, excelencia y autenticidad guían todo lo que hacemos como iglesia.",
};

export default async function NosotrosPage() {
  const [settings, campuses] = await Promise.all([getPublicSiteSettings(), getCampuses()]);
  const apostle = getPastors()[0];

  // La sede principal manda para "Visítanos" — antes se mostraba la dirección
  // suelta de Configuración, sin decir de cuál sede era, y la gente no sabía
  // si esa dirección correspondía a la principal o a otra. Si todavía no hay
  // ninguna sede marcada como principal, cae a la dirección de Configuración
  // (comportamiento de siempre) para no dejar la sección vacía.
  const mainCampus = campuses.find((campus) => campus.isMain) ?? campuses[0];
  const nextService = mainCampus ? findNextService(mainCampus.schedules ?? [], new Date()) : undefined;
  const mainAmenities = mainCampus ? activeCampusAmenities(mainCampus) : [];
  // La sede principal va primero — así "Avísanos que vienes" arranca con esta ya seleccionada.
  const checkinCampuses = mainCampus
    ? [mainCampus, ...campuses.filter((item) => item.slug !== mainCampus.slug)].map((item) => ({
        slug: item.slug,
        name: item.name,
        city: item.city,
      }))
    : [];
  const campusWhatsappHref = mainCampus
    ? buildWhatsAppLink(
        mainCampus.whatsappNumber ?? settings?.whatsappNumber ?? siteConfig.whatsappNumber,
        campusInquiryMessage(mainCampus.fullName)
      )
    : undefined;

  // "Quiénes somos" va destacado, más grande que los otros tres — antes los
  // 4 bloques se veían idénticos en la misma grilla, sin ninguna jerarquía.
  const featuredBlock = {
    icon: Users,
    title: "Quiénes somos",
    text: settings?.aboutQuienesSomos || FALLBACK_TEXT.quienesSomos,
  };
  const blocks: {
    icon: ComponentType<{ className?: string }>;
    title: string;
    text: string;
    iconClass: string;
  }[] = [
    { icon: Compass, title: "Misión", text: settings?.aboutMision || FALLBACK_TEXT.mision, iconClass: "bg-sky-50 text-sky-600" },
    { icon: Eye, title: "Visión", text: settings?.aboutVision || FALLBACK_TEXT.vision, iconClass: "bg-amber-50 text-amber-600" },
    { icon: HandHeart, title: "Valores", text: settings?.aboutValores || FALLBACK_TEXT.valores, iconClass: "bg-rose-50 text-rose-600" },
  ];

  // Mismo patrón que Footer.tsx/LiveSection.tsx: Configuración > Redes
  // sociales manda, y si todavía no hay nada guardado ahí, cae a los links
  // fijos de data/site.ts para no dejar la sección vacía.
  const socialCandidates: (SocialLink | undefined)[] = settings
    ? [
        settings.instagramUrl ? { platform: "instagram" as const, label: "Instagram", url: settings.instagramUrl } : undefined,
        settings.facebookUrl ? { platform: "facebook" as const, label: "Facebook", url: settings.facebookUrl } : undefined,
        settings.youtubeUrl ? { platform: "youtube" as const, label: "YouTube", url: settings.youtubeUrl } : undefined,
        settings.tiktokUrl ? { platform: "tiktok" as const, label: "TikTok", url: settings.tiktokUrl } : undefined,
      ]
    : socialLinks;
  const resolvedSocialLinks = socialCandidates
    .filter((link): link is SocialLink => Boolean(link))
    .filter((link) => link.url && link.url !== "#");

  const visitInfo = [
    mainCampus
      ? {
          icon: MapPin,
          label: `Dirección — ${mainCampus.fullName}${mainCampus.isMain ? " (sede principal)" : ""}`,
          value: mainCampus.city ? `${mainCampus.address}, ${mainCampus.city}` : mainCampus.address,
        }
      : settings?.address && {
          icon: MapPin,
          label: "Dirección",
          value: settings.city ? `${settings.address}, ${settings.city}` : settings.address,
        },
    settings?.generalSchedule && { icon: Clock, label: "Horarios", value: settings.generalSchedule },
    settings?.phone && { icon: Phone, label: "Teléfono", value: settings.phone },
    settings?.email && { icon: Mail, label: "Correo", value: settings.email },
  ].filter((item): item is { icon: typeof MapPin; label: string; value: string } => Boolean(item));

  return (
    <>
      <Breadcrumbs items={[{ label: "Conócenos" }]} />

      <section className="relative overflow-hidden bg-slate-950">
        <PlaceholderImage
          label="[FOTOGRAFÍA NEW LIFE — COMUNIDAD]"
          src={settings?.aboutImageUrl}
          tone="dark"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50" />

        <Container className="relative flex min-h-[45vh] flex-col items-center justify-center gap-4 py-24 text-center text-white">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            Conoce New Life
          </span>
          <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Un lugar para encontrar una nueva vida
          </h1>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading title="Quiénes somos" />

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <RevealOnScroll index={0} className="sm:col-span-3">
              <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 p-10 text-white shadow-lg shadow-brand-900/20 sm:p-12">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                <featuredBlock.icon
                  className="absolute -right-6 -top-6 h-40 w-40 text-white/10 sm:h-48 sm:w-48"
                  aria-hidden="true"
                  strokeWidth={1}
                />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                    <featuredBlock.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-heading text-2xl font-bold sm:text-3xl">{featuredBlock.title}</h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85">{featuredBlock.text}</p>
                </div>
              </div>
            </RevealOnScroll>

            {blocks.map(({ icon: Icon, title, text, iconClass }, index) => (
              <RevealOnScroll key={title} index={index + 1}>
                <div className="group h-full rounded-2xl border border-slate-100 bg-white p-8 shadow-sm shadow-slate-100 transition-all hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/80">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${iconClass}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {visitInfo.length > 0 && (
            <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-slate-100 bg-slate-50 p-8">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-lg font-semibold text-slate-900">Visítanos</h3>
                {nextService && (
                  <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                    Próximo: {dayOfWeekLabel(nextService.dayOfWeek)} {formatEventTime(nextService.time)} — {nextService.title}
                  </span>
                )}
              </div>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {visitInfo.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
                      <dd className="text-sm text-slate-700">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              {mainAmenities.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
                  {mainAmenities.map((amenity) => (
                    <div key={amenity.key} className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 shadow-sm shadow-slate-100">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${amenity.gradient} text-white`}>
                        <amenity.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-semibold text-slate-700">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {mainCampus && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    href={googleMapsDirectionsUrl(mainCampus.mapQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="md"
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" />
                    Cómo llegar
                  </Button>
                  {campusWhatsappHref && (
                    <Button href={campusWhatsappHref} target="_blank" rel="noopener noreferrer" variant="secondary" size="md">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      ¿Tienes dudas antes de venir?
                    </Button>
                  )}
                  <div className="[&>button]:h-full">
                    <VisitCheckinWidget campuses={checkinCampuses} />
                  </div>
                  <Button href="/sedes" variant="ghost" size="md" className="border border-slate-200">
                    ¿Buscas otro campus? Ver todos
                  </Button>
                </div>
              )}
            </div>
          )}

          {apostle && (
            <div className="mx-auto mt-14 flex max-w-2xl flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm shadow-slate-100 sm:flex-row sm:text-left">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full">
                <PlaceholderImage label={apostle.imageLabel} src={apostle.imageSrc} tone="dark" className="h-full w-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Nos lidera</p>
                <h3 className="mt-1 font-heading text-xl font-bold text-slate-900">{apostle.name}</h3>
                <p className="text-sm font-medium text-slate-500">{apostle.role}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{apostle.bio}</p>
              </div>
              <Button href={`/pastores/${apostle.slug}`} variant="ghost" className="shrink-0 border border-slate-200">
                Conócelo
              </Button>
            </div>
          )}

          {campuses.length > 0 && (
            <div className="mt-14">
              <h3 className="text-center font-heading text-lg font-semibold text-slate-900">Nuestros campus</h3>
              <div className="mt-6">
                <AllCampusesMap campuses={campuses} />
              </div>
            </div>
          )}

          {resolvedSocialLinks.length > 0 && (
            <div className="mt-14 flex flex-col items-center gap-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Síguenos</p>
              <div className="flex gap-4">
                {resolvedSocialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-all hover:-translate-y-1 hover:bg-brand-600 hover:text-white"
                  >
                    <SocialIcon platform={social.platform} className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-14 flex justify-center">
            <Button href="/#primeros-pasos" variant="primary" size="lg">
              Quiero ser parte
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
