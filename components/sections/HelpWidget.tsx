"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Clock,
  Gift,
  HandCoins,
  HandHeart,
  Lightbulb,
  Minus,
  Shirt,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { helpOptions, helpWidgetContent, type HelpOptionSlug } from "@/data/help";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink, helpInquiryMessage } from "@/lib/whatsapp";

type Visibility = "open" | "minimized" | "compact";
type WidgetView = "main" | "options";

const CROSSFADE_MS = 150;
const AUTO_MINIMIZE_MS = 4000;

function defaultVisibility(): Visibility {
  // En móvil arranca minimizado para no tapar botones importantes del Hero;
  // en pantallas más grandes abre directo. No se persiste entre recargas.
  return window.innerWidth < 640 ? "minimized" : "open";
}

/** Pequeño crossfade genérico: mantiene el valor anterior visible mientras
 * se desvanece, luego cambia al nuevo y lo desvanece de vuelta a la vista. */
function useCrossfade<T>(value: T) {
  const [displayed, setDisplayed] = useState(value);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (value === displayed) return;
    // Excepción deliberada: iniciar el fade-out es justamente "reaccionar a
    // un cambio externo con un efecto en el tiempo", el caso de uso real de
    // un efecto — no hay forma de derivarlo durante el render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(false);
    const timeout = setTimeout(() => {
      setDisplayed(value);
      setVisible(true);
    }, CROSSFADE_MS);
    return () => clearTimeout(timeout);
  }, [value, displayed]);

  return { displayed, visible };
}

function HelpOptionIcon({ slug, className }: { slug: HelpOptionSlug; className?: string }) {
  switch (slug) {
    case "donacion":
      return <HandCoins className={className} aria-hidden="true" />;
    case "ropa":
      return <Shirt className={className} aria-hidden="true" />;
    case "alimentos":
      return <UtensilsCrossed className={className} aria-hidden="true" />;
    case "articulos":
      return <Gift className={className} aria-hidden="true" />;
    case "tiempo":
      return <Clock className={className} aria-hidden="true" />;
    case "talento":
      return <Lightbulb className={className} aria-hidden="true" />;
    default:
      return <HandHeart className={className} aria-hidden="true" />;
  }
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    >
      {children}
    </button>
  );
}

function WidgetControls({ onMinimize, onClose }: { onMinimize: () => void; onClose: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <IconButton label="Minimizar panel de ayuda" onClick={onMinimize}>
        <Minus className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      <IconButton label="Cerrar panel de ayuda" onClick={onClose}>
        <X className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    </div>
  );
}

function MainView({
  onHelp,
  onMinimize,
  onClose,
}: {
  onHelp: () => void;
  onMinimize: () => void;
  onClose: () => void;
}) {
  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <HandHeart className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="font-heading text-base font-bold leading-tight text-slate-900">
            {helpWidgetContent.title}
          </h2>
        </div>
        <WidgetControls onMinimize={onMinimize} onClose={onClose} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">{helpWidgetContent.description}</p>

      <Button type="button" variant="primary" className="mt-5 w-full justify-center" onClick={onHelp}>
        {helpWidgetContent.ctaLabel}
      </Button>
    </div>
  );
}

function OptionsView({
  onBack,
  onMinimize,
  onClose,
}: {
  onBack: () => void;
  onMinimize: () => void;
  onClose: () => void;
}) {
  return (
    <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Volver
        </button>
        <WidgetControls onMinimize={onMinimize} onClose={onClose} />
      </div>

      <h3 className="mt-3 font-heading text-base font-bold text-slate-900">
        {helpWidgetContent.optionsTitle}
      </h3>

      <ul className="mt-4 space-y-2.5">
        {helpOptions.map((option) => (
          <li key={option.slug}>
            <a
              href={buildWhatsAppLink(siteConfig.whatsappNumber, helpInquiryMessage(option.title))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-brand-200 hover:bg-brand-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                <HelpOptionIcon slug={option.slug} className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{option.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{option.description}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Widget flotante de ayuda/donaciones del Home. Cada opción abre WhatsApp con
 * un mensaje ya escrito (ver data/help.ts) — nada de pagos ni formularios
 * propios todavía. El estado (abierto/minimizado/compacto) no se persiste:
 * siempre arranca con el valor por defecto según el ancho de pantalla, y
 * siempre tiene una forma visible de reabrirse (nunca desaparece del todo).
 */
export function HelpWidget() {
  const [ready, setReady] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>("open");
  const [view, setView] = useState<WidgetView>("main");
  const [entered, setEntered] = useState(false);

  const { displayed: displayedVisibility, visible: visibilityVisible } = useCrossfade(visibility);
  const { displayed: displayedView, visible: viewVisible } = useCrossfade(view);

  // En cuanto la persona toca los controles (minimizar/cerrar/reabrir/Escape)
  // se desactiva para siempre el auto-minimizado: es solo una "vitrina" para
  // quien no interactúa, nunca debe pelearse con una acción manual.
  const userInteractedRef = useRef(false);

  function setVisibilityFromUser(next: Visibility) {
    userInteractedRef.current = true;
    setVisibility(next);
  }

  useEffect(() => {
    // Excepción deliberada, igual que en useAdminContent: window.innerWidth
    // no existe en el render de servidor, así que se lee una sola vez tras
    // el montaje para no romper la hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibility(defaultVisibility());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(raf1);
  }, [ready]);

  useEffect(() => {
    if (visibility !== "open") return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setVisibilityFromUser("minimized");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visibility]);

  useEffect(() => {
    // Se programa una sola vez, justo tras montar (depende únicamente de
    // `ready`): muestra el panel grande unos segundos como "vitrina" y luego
    // se minimiza solo — igual que si alguien presionara "Minimizar". Si para
    // entonces ya no sigue "open", o la persona ya tocó los controles
    // (userInteractedRef), el updater funcional no hace nada.
    if (!ready) return;
    const timeout = setTimeout(() => {
      setVisibility((current) =>
        current === "open" && !userInteractedRef.current ? "minimized" : current
      );
    }, AUTO_MINIMIZE_MS);
    return () => clearTimeout(timeout);
  }, [ready]);

  function openWidget() {
    setVisibilityFromUser("open");
    setView("main");
  }

  if (!ready) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-40 transition-all duration-500 ease-out sm:bottom-6 sm:right-6",
        entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <div
        className={cn(
          "transition-opacity ease-out",
          visibilityVisible ? "opacity-100 duration-200" : "opacity-0 duration-150"
        )}
      >
        {displayedVisibility === "compact" ? (
          <button
            type="button"
            onClick={openWidget}
            aria-label="Abrir ayuda y donaciones"
            title="Ayuda y donaciones"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <HandHeart className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : displayedVisibility === "minimized" ? (
          <button
            type="button"
            onClick={openWidget}
            aria-label="Abrir panel de ayuda y donaciones"
            className="flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-brand-900/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <HandHeart className="h-4 w-4" aria-hidden="true" />
            Ayudar
          </button>
        ) : (
          <div
            role="dialog"
            aria-label="Panel de ayuda y donaciones"
            className="w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/20"
          >
            <div
              className={cn(
                "transition-opacity ease-out",
                viewVisible ? "opacity-100 duration-200" : "opacity-0 duration-150"
              )}
            >
              {displayedView === "main" ? (
                <MainView
                  onHelp={() => setView("options")}
                  onMinimize={() => setVisibilityFromUser("minimized")}
                  onClose={() => setVisibilityFromUser("compact")}
                />
              ) : (
                <OptionsView
                  onBack={() => setView("main")}
                  onMinimize={() => setVisibilityFromUser("minimized")}
                  onClose={() => setVisibilityFromUser("compact")}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
