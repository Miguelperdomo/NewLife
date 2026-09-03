import { Eye, Pencil, Trash2 } from "lucide-react";
import { ContentCover } from "@/components/ui/ContentCover";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { AdminCampus } from "@/lib/admin/types";

export function CampusTable({
  campuses,
  onView,
  onEdit,
  onDelete,
}: {
  campuses: AdminCampus[];
  onView: (campus: AdminCampus) => void;
  onEdit: (campus: AdminCampus) => void;
  onDelete: (campus: AdminCampus) => void;
}) {
  if (campuses.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Todavía no hay sedes registradas.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
            <th className="px-4 py-3 font-semibold">Sede</th>
            <th className="px-4 py-3 font-semibold">Dirección</th>
            <th className="px-4 py-3 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {campuses.map((campus) => (
            <tr key={campus.id} className="align-middle">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                    {campus.imageSrc ? (
                      <PlaceholderImage label={campus.name} src={campus.imageSrc} className="h-full w-full" />
                    ) : (
                      <ContentCover kind="campus" className="h-full w-full" />
                    )}
                  </div>
                  <span className="font-medium text-slate-900">
                    {campus.name}
                    {campus.isMain && (
                      <span className="ml-2 text-xs font-semibold text-brand-600">★ Principal</span>
                    )}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-500">{campus.address}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <RowAction label="Ver" onClick={() => onView(campus)} icon={Eye} />
                  <RowAction label="Editar" onClick={() => onEdit(campus)} icon={Pencil} />
                  <RowAction label="Eliminar" onClick={() => onDelete(campus)} icon={Trash2} />
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
