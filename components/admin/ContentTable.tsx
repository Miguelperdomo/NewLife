import { Archive, Copy, Eye, Pencil } from "lucide-react";
import { ContentCover } from "@/components/ui/ContentCover";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { formatEventDate } from "@/lib/events";
import type { ContentRow } from "@/lib/admin/types";
import { StatusBadge } from "./StatusBadge";

export type { ContentRow };

export function ContentTable({
  rows,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
}: {
  rows: ContentRow[];
  onView: (row: ContentRow) => void;
  onEdit: (row: ContentRow) => void;
  onDuplicate: (row: ContentRow) => void;
  onArchive: (row: ContentRow) => void;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        No hay contenido que coincida con estos filtros.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
            <th className="px-4 py-3 font-semibold">Contenido</th>
            <th className="px-4 py-3 font-semibold">Tipo</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Fecha</th>
            <th className="px-4 py-3 font-semibold">Ministerio</th>
            <th className="px-4 py-3 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id} className="align-middle">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                    {row.imageSrc ? (
                      <PlaceholderImage label={row.title} src={row.imageSrc} className="h-full w-full" />
                    ) : (
                      <ContentCover kind={row.type} className="h-full w-full" />
                    )}
                  </div>
                  <span className="font-medium text-slate-900">
                    {row.title}
                    {row.featured && (
                      <span className="ml-2 text-xs font-semibold text-accent-600">★ Destacado</span>
                    )}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-500">{row.type === "event" ? "Evento" : "Noticia"}</td>
              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                {formatEventDate(row.date)}
              </td>
              <td className="px-4 py-3 text-slate-500">{row.ministryLabel ?? "—"}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <RowAction label="Ver" onClick={() => onView(row)} icon={Eye} />
                  <RowAction label="Editar" onClick={() => onEdit(row)} icon={Pencil} />
                  <RowAction label="Duplicar" onClick={() => onDuplicate(row)} icon={Copy} />
                  {row.status !== "archived" && (
                    <RowAction label="Archivar" onClick={() => onArchive(row)} icon={Archive} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RowAction({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: typeof Eye;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
