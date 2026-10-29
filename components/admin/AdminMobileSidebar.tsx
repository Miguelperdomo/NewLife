"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import type { AdminSection } from "@/lib/admin/types";

// el <aside> del layout se oculta en móvil, así que esto es lo único que da acceso al menú ahí
export function AdminMobileSidebar({ sections }: { sections: AdminSection[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // cierra el panel al cambiar de página
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-slate-950/60 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú del panel administrativo"
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-slate-950 text-white shadow-2xl transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div>
              <Logo variant="light" />
              <p className="mt-1 text-xs uppercase tracking-widest text-white/40">Panel administrativo</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <AdminSidebarNav sections={sections} onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </>
  );
}
