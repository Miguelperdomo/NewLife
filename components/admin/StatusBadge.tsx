import { cn } from "@/lib/utils";
import type { ContentStatus } from "@/lib/admin/types";

const statusStyles: Record<ContentStatus, string> = {
  draft: "border-slate-300 bg-slate-100 text-slate-600",
  published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  scheduled: "border-brand-200 bg-brand-50 text-brand-700",
  archived: "border-slate-200 bg-slate-50 text-slate-400",
};

const statusLabels: Record<ContentStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  scheduled: "Programado",
  archived: "Archivado",
};

export function StatusBadge({ status, className }: { status: ContentStatus; className?: string }) {
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
