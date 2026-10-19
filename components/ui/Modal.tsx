"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    // En celular ocupa toda la pantalla (nada de fondo borroso visible detrás,
    // como una pantalla nueva) — en pantallas grandes (sm:) vuelve a ser un
    // diálogo centrado y angosto, con el fondo borroso alrededor.
    <div className="fixed inset-0 z-50 flex justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-brand-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative h-full w-full overflow-y-auto bg-white p-6 shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl sm:p-8",
          className
        )}
      >
        <div className="flex items-center justify-between gap-4">
          {title && <h2 className="font-heading text-lg font-bold text-slate-900">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
