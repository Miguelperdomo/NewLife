import { cn } from "@/lib/utils";
import type { EventStatus } from "@/lib/events";

const statusStyles: Record<EventStatus, string> = {
  hoy: "border-red-500/30 bg-red-500/10 text-red-600",
  proximo: "border-brand-100 bg-brand-50 text-brand-600",
  finalizado: "border-slate-200 bg-slate-100 text-slate-500",
};

const statusLabels: Record<EventStatus, string> = {
  hoy: "Hoy",
  proximo: "Próximo",
  finalizado: "Finalizado",
};

export function EventBadge({ status, className }: { status: EventStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
