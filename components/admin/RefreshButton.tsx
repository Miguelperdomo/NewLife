"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// botón "Actualizar" para refrescar una lista sin F5
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
