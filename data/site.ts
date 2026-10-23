import { liveLinks } from "@/data/live";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { NavLink, SocialLink } from "@/lib/types";

// [CONTENIDO TEMPORAL] Reemplazar con la información oficial de New Life.
export const siteConfig = {
  name: "New Life",
  tagline: "Una nueva vida comienza aquí.",
  description:
    "Somos una comunidad cristiana donde puedes conocer a Dios, crecer en fe y caminar acompañado.",
  contactEmail: "[CORREO DE CONTACTO — PLACEHOLDER]",
  contactPhone: "[TELÉFONO DE CONTACTO — PLACEHOLDER]",
  whatsappNumber: "573160539301",
  logoSrc: "/img/logo-principal.jpeg",
};

export const navLinks: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Conócenos", href: "/nosotros" },
  { label: "Ministerios", href: "/ministerios" },
  { label: "Eventos", href: "/eventos" },
  // Noticias — comentado a propósito, por ahora no se muestra en el menú ni
  // en el pie de página (Footer reutiliza este mismo arreglo). Para
  // reactivarlo, solo descomenta esta línea.
  // { label: "Noticias", href: "/noticias" },
  { label: "Campus", href: "/sedes" },
  { label: "Apóstol", href: "/pastores" },
];

// [LINKS PLACEHOLDER] Reemplazar con los enlaces oficiales de New Life.
export const socialLinks: SocialLink[] = [
  { platform: "instagram", label: "Instagram", url: "#" },
  { platform: "facebook", label: "Facebook", url: "#" },
  { platform: "youtube", label: "YouTube", url: liveLinks.youtube },
  { platform: "tiktok", label: "TikTok", url: "#" },
  {
    platform: "whatsapp",
    label: "WhatsApp",
    url: buildWhatsAppLink(
      siteConfig.whatsappNumber,
      "Hola New Life, quisiera más información."
    ),
  },
];
