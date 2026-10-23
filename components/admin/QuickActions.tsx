"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, History, LayoutDashboard, MapPinPlus, Pin, PinOff, Settings, UserCog, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { AdminSection } from "@/lib/admin/types";

const PIN_STORAGE_KEY = "newlife-admin-pinned-actions";

interface ActionDef {
  id: string;
  section: AdminSection;
  href: string;
  label: string;
  icon: typeof UsersRound;
}

const ACTIONS: ActionDef[] = [
  { id: "ministerio", section: "ministries", href: "/admin/ministerios/nuevo", label: "Crear ministerio", icon: UsersRound },
  { id: "sede", section: "campuses", href: "/admin/sedes/nueva", label: "Crear sede", icon: MapPinPlus },
  { id: "contenido", section: "content", href: "/admin/contenido", label: "Ver contenido", icon: LayoutDashboard },
  { id: "evento", section: "content", href: "/admin/contenido/nuevo?type=event", label: "Crear evento", icon: CalendarPlus },
  { id: "usuario", section: "full", href: "/admin/usuarios", label: "Crear usuario", icon: UserCog },
  { id: "actividad", section: "full", href: "/admin/actividad", label: "Ver actividad", icon: History },
];

/**
 * Cuáles accesos quedan primero es una preferencia de cada persona que usa
 * el panel (guardada en su propio navegador, no en la base de datos) — mismo
 * patrón que AccessibilityMenu.tsx.
 */
function usePinnedActions() {
  const [pinned, setPinned] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PIN_STORAGE_KEY);
      const saved = raw ? (JSON.parse(raw) as unknown) : null;
      if (Array.isArray(saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPinned(saved.filter((item): item is string => typeof item === "string"));
      }
    } catch {
      // Privado/bloqueado: sin pines guardados, sin romper nada.
    }
  }, []);

  function togglePin(id: string) {
    setPinned((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try {
        localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Silencioso — ver comentario de arriba.
      }
      return next;
    });
  }

  return { pinned, togglePin };
}

export function QuickActions({ sections }: { sections: AdminSection[] }) {
  const canSeeAll = sections.includes("full");
  const can = (section: AdminSection) => canSeeAll || sections.includes(section);
  const { pinned, togglePin } = usePinnedActions();

  const visibleActions = ACTIONS.filter((action) => can(action.section)).sort(
    (a, b) => Number(pinned.includes(b.id)) - Number(pinned.includes(a.id))
  );

  return (
    <div>
      <h2 className="font-heading text-lg font-bold text-slate-900">Acciones rápidas</h2>

      {can("settings") && (
        <Button href="/admin/configuracion" variant="primary" className="mt-4 w-full justify-center sm:w-auto">
          <Settings className="h-4 w-4" aria-hidden="true" />
          Empieza por aquí: Configuración
        </Button>
      )}

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {visibleActions.map((action) => {
          const isPinned = pinned.includes(action.id);
          return (
            <div key={action.id} className="group relative">
              <Button href={action.href} variant="ghost" className="w-full justify-center border border-slate-200">
                <action.icon className="h-4 w-4" aria-hidden="true" />
                {action.label}
              </Button>
              <button
                type="button"
                onClick={() => togglePin(action.id)}
                aria-label={isPinned ? `Quitar "${action.label}" de los primeros` : `Poner "${action.label}" primero`}
                className={cn(
                  "absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-sm transition-opacity",
                  isPinned
                    ? "border-accent-300 text-accent-600 opacity-100"
                    : "border-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                )}
              >
                {isPinned ? <Pin className="h-3 w-3" aria-hidden="true" /> : <PinOff className="h-3 w-3" aria-hidden="true" />}
              </button>
            </div>
          );
        })}
        {/* "Crear noticia" — comentado a propósito, Noticias está en pausa
            por ahora. El módulo sigue funcionando completo desde "Ver
            contenido" si hace falta crear una detrás de cámaras; esto solo
            quita el atajo directo. Para reactivarlo, agrégalo a ACTIONS
            arriba (icon: Newspaper). */}
      </div>
    </div>
  );
}
