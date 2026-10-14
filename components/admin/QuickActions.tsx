import { CalendarPlus, LayoutDashboard, MapPinPlus, Newspaper, Settings, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function QuickActions() {
  return (
    <div>
      <h2 className="font-heading text-lg font-bold text-slate-900">Acciones rápidas</h2>

      <Button href="/admin/configuracion" variant="primary" className="mt-4 w-full justify-center sm:w-auto">
        <Settings className="h-4 w-4" aria-hidden="true" />
        Empieza por aquí: Configuración
      </Button>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Button href="/admin/ministerios/nuevo" variant="ghost" className="justify-center border border-slate-200">
          <UsersRound className="h-4 w-4" aria-hidden="true" />
          Crear ministerio
        </Button>
        <Button href="/admin/sedes/nueva" variant="ghost" className="justify-center border border-slate-200">
          <MapPinPlus className="h-4 w-4" aria-hidden="true" />
          Crear sede
        </Button>
        <Button href="/admin/contenido" variant="ghost" className="justify-center border border-slate-200">
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          Ver contenido
        </Button>
        <Button href="/admin/contenido/nuevo?type=event" variant="ghost" className="justify-center border border-slate-200">
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          Crear evento
        </Button>
        <Button href="/admin/contenido/nuevo?type=news" variant="ghost" className="justify-center border border-slate-200">
          <Newspaper className="h-4 w-4" aria-hidden="true" />
          Crear noticia
        </Button>
      </div>
    </div>
  );
}
