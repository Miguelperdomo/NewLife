import { Archive, Copy, Eye, EyeOff, Pencil, RotateCcw } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { AdminPastor } from "@/lib/admin/types";
import { ActiveStatusBadge } from "./ActiveStatusBadge";

export function PastorTable({
  pastors,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onActivate,
}: {
  pastors: AdminPastor[];
  onView: (pastor: AdminPastor) => void;
  onEdit: (pastor: AdminPastor) => void;
  onDuplicate: (pastor: AdminPastor) => void;
  onArchive: (pastor: AdminPastor) => void;
  onActivate: (pastor: AdminPastor) => void;
}) {
  if (pastors.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        No encontramos pastores que coincidan con tu búsqueda.
      </p>
    );
  }

  return (
    <>
      {/* Desktop/tablet: tabla, igual patrón que MinistryTable. */}
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-semibold">Pastor</th>
              <th className="px-4 py-3 font-semibold">Nivel</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pastors.map((pastor) => (
              <tr key={pastor.id} className="align-middle">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <PlaceholderImage label={pastor.name} src={pastor.imageSrc} tone="dark" className="h-full w-full" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{pastor.name}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{pastor.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{pastor.tier}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ActiveStatusBadge status={pastor.status} />
                    <VisibilityIcon showPublicly={pastor.showPublicly} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <RowAction label="Ver" onClick={() => onView(pastor)} icon={Eye} />
                    <RowAction label="Editar" onClick={() => onEdit(pastor)} icon={Pencil} />
                    <RowAction label="Duplicar" onClick={() => onDuplicate(pastor)} icon={Copy} />
                    {pastor.status === "archived" ? (
                      <RowAction label="Activar" onClick={() => onActivate(pastor)} icon={RotateCcw} />
                    ) : (
                      <RowAction label="Archivar" onClick={() => onArchive(pastor)} icon={Archive} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: tarjetas — sin scroll horizontal. */}
      <div className="space-y-3 sm:hidden">
        {pastors.map((pastor) => (
          <div key={pastor.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <PlaceholderImage label={pastor.name} src={pastor.imageSrc} tone="dark" className="h-full w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{pastor.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{pastor.role}</p>
                <div className="mt-2 flex items-center gap-2">
                  <ActiveStatusBadge status={pastor.status} />
                  <VisibilityIcon showPublicly={pastor.showPublicly} />
                </div>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
              <div>
                <dt className="font-semibold text-slate-400">Nivel</dt>
                <dd className="mt-0.5">{pastor.tier}</dd>
              </div>
            </dl>

            <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-3">
              <RowAction label="Ver" onClick={() => onView(pastor)} icon={Eye} />
              <RowAction label="Editar" onClick={() => onEdit(pastor)} icon={Pencil} />
              <RowAction label="Duplicar" onClick={() => onDuplicate(pastor)} icon={Copy} />
              {pastor.status === "archived" ? (
                <RowAction label="Activar" onClick={() => onActivate(pastor)} icon={RotateCcw} />
              ) : (
                <RowAction label="Archivar" onClick={() => onArchive(pastor)} icon={Archive} />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function VisibilityIcon({ showPublicly }: { showPublicly: boolean }) {
  const label = showPublicly ? "Visible en el sitio público" : "Oculto del sitio público";
  return (
    <span title={label} aria-label={label} className={showPublicly ? "text-emerald-600" : "text-slate-400"}>
      {showPublicly ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
    </span>
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
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
