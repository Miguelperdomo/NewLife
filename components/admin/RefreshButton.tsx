"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/** Botón "Actualizar" junto a un título — para refrescar una lista sin F5, cuando llega información nueva mientras la pantalla está abierta. */
export function RefreshButton({ onClick, refreshing }: { onClick: () => void; refreshing: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={refreshing}
      aria-label="Actualizar"
      title="Actualizar"
      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
    >
      <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} aria-hidden="true" />
      Actualizar
    </button>
  );
}
