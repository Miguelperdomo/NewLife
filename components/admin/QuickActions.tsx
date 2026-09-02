import { CalendarPlus, LayoutDashboard, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function QuickActions() {
  return (
    <div>
      <h2 className="font-heading text-lg font-bold text-slate-900">Acciones rápidas</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Button href="/admin/contenido/nuevo?type=event" variant="primary" className="justify-center">
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          Crear evento
        </Button>
        <Button href="/admin/contenido/nuevo?type=news" variant="primary" className="justify-center">
          <Newspaper className="h-4 w-4" aria-hidden="true" />
          Crear noticia
        </Button>
        <Button href="/admin/contenido" variant="ghost" className="justify-center border border-slate-200">
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          Ver contenido
        </Button>
      </div>
    </div>
  );
}
