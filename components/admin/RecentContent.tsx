import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContentCover } from "@/components/ui/ContentCover";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { ContentRow } from "@/lib/admin/types";
import { StatusBadge } from "./StatusBadge";

function formatUpdatedAt(iso: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function RecentContent({ rows }: { rows: ContentRow[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-slate-900">Contenido reciente</h2>
        <Link
          href="/admin/contenido"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Ver todo
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {rows.length > 0 ? (
        <ul className="mt-4 divide-y divide-slate-100">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/admin/contenido/${row.id}/editar?type=${row.type}`}
                className="flex items-center gap-3 py-3 transition-colors hover:bg-slate-50"
              >
                <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg">
                  {row.imageSrc ? (
                    <PlaceholderImage label={row.title} src={row.imageSrc} className="h-full w-full" />
                  ) : (
                    <ContentCover kind={row.type} className="h-full w-full" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{row.title}</p>
                  <p className="text-xs text-slate-400">
                    {row.type === "event" ? "Evento" : "Noticia"} · {formatUpdatedAt(row.updatedAt)}
                  </p>
                </div>
                <StatusBadge status={row.status} className="shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">Todavía no hay contenido.</p>
      )}
    </div>
  );
}
