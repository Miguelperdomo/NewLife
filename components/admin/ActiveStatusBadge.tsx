import { cn } from "@/lib/utils";

export type ActiveOrArchived = "active" | "archived";

// Compartido por los módulos con solo 2 estados (Ministerios, Pastores) — a
// diferencia de StatusBadge.tsx, que está tipado a ContentStatus
// (draft/published/scheduled/archived) para Eventos/Noticias.
const statusStyles: Record<ActiveOrArchived, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived: "border-slate-200 bg-slate-50 text-slate-400",
};

const statusLabels: Record<ActiveOrArchived, string> = {
  active: "Activo",
  archived: "Archivado",
};

export function ActiveStatusBadge({ status, className }: { status: ActiveOrArchived; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
