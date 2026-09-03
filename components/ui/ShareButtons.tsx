"use client";

import { useEffect, useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { buildFacebookShareLink, buildWhatsAppShareLink } from "@/lib/share";
import { cn } from "@/lib/utils";

/** Botón circular compartido por los tres enlaces de compartir. */
function ShareButton({
  href,
  onClick,
  label,
  children,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const className =
    "flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={className}>
      {children}
    </button>
  );
}

/**
 * Compartir por WhatsApp/Facebook + copiar enlace. La URL real (dominio +
 * ruta) solo se conoce en el navegador, así que se lee tras el montaje —
 * mismo patrón que HelpWidget/ScrollReveal para no romper la hidratación.
 */
export function ShareButtons({ title, className }: { title: string; className?: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(window.location.href);
  }, []);

  async function handleCopy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Portapapeles no disponible (permisos, navegador antiguo) — no es crítico.
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Compartir</span>

      <ShareButton href={buildWhatsAppShareLink(`${title} — ${url}`)} label="Compartir por WhatsApp">
        <SocialIcon platform="whatsapp" className="h-4 w-4" />
      </ShareButton>

      <ShareButton href={buildFacebookShareLink(url)} label="Compartir en Facebook">
        <SocialIcon platform="facebook" className="h-4 w-4" />
      </ShareButton>

      <ShareButton onClick={handleCopy} label="Copiar enlace">
        {copied ? (
          <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
        ) : (
          <LinkIcon className="h-4 w-4" aria-hidden="true" />
        )}
      </ShareButton>

      {copied && <span className="text-xs font-medium text-green-600">¡Enlace copiado!</span>}
    </div>
  );
}
