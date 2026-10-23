import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { navLinks, siteConfig, socialLinks } from "@/data/site";
import { getCampuses, getMinistries } from "@/lib/content";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";
import type { NavLink, SocialLink } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
        {title}
      </h3>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const [ministries, campuses] = await Promise.all([getMinistries(), getCampuses()]);
  const ministryLinks: NavLink[] = ministries.map((ministry) => ({
    label: ministry.name,
    href: `/ministerios/${ministry.slug}`,
  }));
  const campusLinks: NavLink[] = campuses.map((campus) => ({
    label: campus.name,
    href: `/sedes/${campus.slug}`,
  }));
  const mainCampus = campuses.find((campus) => campus.isMain);

  // Configuración real de Supabase — si todavía no se ha guardado nada ahí
  // (settings === null), se cae a los valores de siempre en data/site.ts
  // para que el Footer nunca se vea vacío/roto.
  const settings = await getPublicSiteSettings();
  const churchName = settings?.churchName || siteConfig.name;
  const description = settings?.description || siteConfig.description;
  const contactEmail = settings?.email || siteConfig.contactEmail;
  const contactPhone = settings?.phone || siteConfig.contactPhone;
  const address = settings?.address || mainCampus?.address;

  // Si la persona activó el ícono de WhatsApp pero no pegó un link propio,
  // se arma uno con el número + mensaje predeterminado de Configuración —
  // así ambos campos sirven para algo real en vez de quedar sueltos.
  const whatsappSocialUrl =
    settings?.whatsappSocialUrl ||
    (settings?.whatsappSocialEnabled
      ? buildWhatsAppLink(settings.whatsappNumber, settings.whatsappDefaultMessage)
      : undefined);

  const resolvedSocialLinks: SocialLink[] = (
    settings
      ? [
          settings.instagramUrl && { platform: "instagram" as const, label: "Instagram", url: settings.instagramUrl },
          settings.facebookUrl && { platform: "facebook" as const, label: "Facebook", url: settings.facebookUrl },
          settings.youtubeUrl && { platform: "youtube" as const, label: "YouTube", url: settings.youtubeUrl },
          settings.tiktokUrl && { platform: "tiktok" as const, label: "TikTok", url: settings.tiktokUrl },
          whatsappSocialUrl && { platform: "whatsapp" as const, label: "WhatsApp", url: whatsappSocialUrl },
        ].filter((link): link is SocialLink => Boolean(link))
      : socialLinks
  ).filter((link) => link.url && link.url !== "#");

  return (
    <footer className="border-t border-slate-100 bg-slate-950 text-slate-300">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo variant="light" logoSrc={settings?.logoUrl} name={churchName} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            {description}
          </p>
        </div>

        <FooterColumn title="Enlaces" links={navLinks} />
        <FooterColumn title="Ministerios" links={ministryLinks} />
        <FooterColumn title="Campus" links={campusLinks} />
      </Container>

      <div className="border-t border-white/10">
        <Container className="grid gap-8 py-10 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Contacto</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {contactEmail && <li>{contactEmail}</li>}
              {contactPhone && <li>{contactPhone}</li>}
              {address && (
                <li>
                  {address}
                  {settings?.city ? `, ${settings.city}` : ""}
                </li>
              )}
              {settings?.generalSchedule && <li>{settings.generalSchedule}</li>}
              {mainCampus && (
                <li>
                  <Link href="/sedes" className="text-slate-300 underline-offset-2 hover:text-white hover:underline">
                    Ver todos los campus
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="sm:text-right">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Síguenos</h3>
            <div className="mt-4 flex gap-3 sm:justify-end">
              {resolvedSocialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand-600"
                >
                  <SocialIcon platform={social.platform} className="h-5 w-5" />
                </a>
              ))}
            </div>
            <Link
              href="/#primeros-pasos"
              className="mt-4 inline-block text-sm font-medium text-slate-300 underline-offset-2 hover:text-white hover:underline"
            >
              ¿Es tu primera vez? Empieza aquí →
            </Link>
          </div>
        </Container>
      </div>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {churchName}. Todos los derechos
            reservados.
          </p>
          <p className="flex items-center gap-3">
            <Link href="/privacidad" className="underline-offset-2 hover:text-white hover:underline">
              Privacidad
            </Link>
            <Link href="/terminos" className="underline-offset-2 hover:text-white hover:underline">
              Términos
            </Link>
          </p>
        </Container>
        <Container className="mt-3 text-center text-xs text-slate-600">
          <p>
            Diseñado y desarrollado por{" "}
            <a
              href="https://providentiatech.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-400 transition-colors hover:text-white"
            >
              Providentia Tech
            </a>{" "}
            · Ibagué, Colombia
          </p>
        </Container>
      </div>
    </footer>
  );
}
