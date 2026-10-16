import { CalendarPlus, LayoutDashboard, MapPinPlus, Settings, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AdminSection } from "@/lib/admin/types";

export function QuickActions({ sections }: { sections: AdminSection[] }) {
  const canSeeAll = sections.includes("full");
  const can = (section: AdminSection) => canSeeAll || sections.includes(section);

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
        {can("ministries") && (
          <Button href="/admin/ministerios/nuevo" variant="ghost" className="justify-center border border-slate-200">
            <UsersRound className="h-4 w-4" aria-hidden="true" />
            Crear ministerio
          </Button>
        )}
        {can("campuses") && (
          <Button href="/admin/sedes/nueva" variant="ghost" className="justify-center border border-slate-200">
            <MapPinPlus className="h-4 w-4" aria-hidden="true" />
            Crear sede
          </Button>
        )}
        {can("content") && (
          <>
            <Button href="/admin/contenido" variant="ghost" className="justify-center border border-slate-200">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Ver contenido
            </Button>
            <Button
              href="/admin/contenido/nuevo?type=event"
              variant="ghost"
              className="justify-center border border-slate-200"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden="true" />
              Crear evento
            </Button>
          </>
        )}
        {/* "Crear noticia" — comentado a propósito, Noticias está en pausa
            por ahora. El módulo sigue funcionando completo desde "Ver
            contenido" si hace falta crear una detrás de cámaras; esto solo
            quita el atajo directo. Para reactivarlo, descomenta este botón
            (y vuelve a importar Newspaper de lucide-react arriba). */}
        {/* <Button href="/admin/contenido/nuevo?type=news" variant="ghost" className="justify-center border border-slate-200">
          <Newspaper className="h-4 w-4" aria-hidden="true" />
          Crear noticia
        </Button> */}
      </div>
    </div>
  );
}
