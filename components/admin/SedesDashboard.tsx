"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { useAdminCampuses } from "@/lib/admin/useAdminCampuses";
import type { AdminCampus } from "@/lib/admin/types";
import { CampusPreview } from "./CampusPreview";
import { CampusTable } from "./CampusTable";

export function SedesDashboard() {
  const router = useRouter();
  const { campuses, isReady, removeCampus } = useAdminCampuses();
  const [previewCampus, setPreviewCampus] = useState<AdminCampus | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCampus | null>(null);

  function confirmDelete() {
    if (!deleteTarget) return;
    removeCampus(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900">Sedes</h2>
          <p className="mt-1 text-sm text-slate-500">
            Campus y ubicaciones de New Life. {campuses.length} sede{campuses.length === 1 ? "" : "s"} en total.
          </p>
        </div>
        <Button href="/admin/sedes/nueva" variant="primary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Crear sede
        </Button>
      </div>

      {isReady ? (
        <CampusTable
          campuses={campuses}
          onView={setPreviewCampus}
          onEdit={(campus) => router.push(`/admin/sedes/${campus.id}/editar`)}
          onDelete={setDeleteTarget}
        />
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Cargando sedes…
        </p>
      )}

      <Modal open={previewCampus !== null} onClose={() => setPreviewCampus(null)} title="Vista previa">
        {previewCampus && <CampusPreview campus={previewCampus} />}
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Eliminar sede"
        confirmLabel="Eliminar"
        description={
          <>
            ¿Eliminar <strong className="font-semibold text-slate-900">“{deleteTarget?.name}”</strong>? Esta
            acción no se puede deshacer.
            {deleteTarget?.isMain && (
              <>
                {" "}
                Es la sede marcada como <strong className="font-semibold text-slate-900">principal</strong> —
                considera marcar otra como principal después de eliminarla.
              </>
            )}
          </>
        }
      />
    </div>
  );
}
