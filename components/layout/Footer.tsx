import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { navLinks, siteConfig, socialLinks } from "@/data/site";
import { getCampuses, getMinistries } from "@/lib/content";
import type { NavLink } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// Número de contacto de Providentia Tech (el desarrollador), no de New Life.
const PROVIDENTIA_TECH_WHATSAPP = "573133854821";
const PROVIDENTIA_TECH_MESSAGE =
  "Hola Providentia Tech, vi el sitio de New Life y quiero más información sobre sus servicios.";

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

export function Footer() {
  const ministryLinks: NavLink[] = getMinistries().map((ministry) => ({
    label: ministry.name,
    href: `/ministerios/${ministry.slug}`,
  }));
  const mainCampus = getCampuses().find((campus) => campus.isMain);

  return (
    <footer className="border-t border-slate-100 bg-slate-950 text-slate-300">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo variant="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            {siteConfig.description}
          </p>
        </div>

        <FooterColumn title="Enlaces" links={navLinks} />
        <FooterColumn title="Ministerios" links={ministryLinks} />

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>{siteConfig.contactEmail}</li>
            <li>{siteConfig.contactPhone}</li>
            {mainCampus && (
              <li>
                {mainCampus.address}
                <br />
                <Link href="/sedes" className="text-slate-300 underline-offset-2 hover:text-white hover:underline">
                  Ver todas las sedes
                </Link>
              </li>
            )}
          </ul>
          <div className="mt-6 flex gap-3">
            {socialLinks.map((social) => (
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
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
            reservados.
          </p>
          <p>Sitio en desarrollo — contenido temporal sujeto a cambios.</p>
        </Container>
        <Container className="mt-3 text-center text-xs text-slate-600">
          <p>
            Diseñado y desarrollado por{" "}
            <a
              href={buildWhatsAppLink(PROVIDENTIA_TECH_WHATSAPP, PROVIDENTIA_TECH_MESSAGE)}
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
