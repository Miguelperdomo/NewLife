"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Botón "Instalar app" — usa el evento nativo `beforeinstallprompt`, que
 * SOLO disparan navegadores compatibles (Chrome/Edge en Android o
 * computador) cuando el sitio ya cumple los requisitos (manifest válido,
 * HTTPS). En Safari/iPhone ese evento no existe — ahí el botón nunca
 * aparece, sin dejar un hueco vacío ni confundir a nadie con algo que no
 * va a funcionar. `appinstalled` lo oculta después de instalarlo.
 */
export function InstallAppButton() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }
    function handleAppInstalled() {
      setInstallEvent(null);
      setInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!installEvent || installed) return null;

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setInstallEvent(null);
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      aria-label="Instalar app de New Life"
      title="Instalar app"
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 sm:px-3"
    >
      <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline">Instalar app</span>
    </button>
  );
}
