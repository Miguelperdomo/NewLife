"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { useAdminPastors } from "@/lib/admin/useAdminPastors";
import type { AdminPastor } from "@/lib/admin/types";
import { PastorFilters, type PastorFiltersValue } from "./PastorFilters";
import { PastorPreview } from "./PastorPreview";
import { PastorTable } from "./PastorTable";

export function PastoresDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pastors, isReady, duplicatePastor, archivePastor, activatePastor } = useAdminPastors();
  const [filters, setFilters] = useState<PastorFiltersValue>({ query: "", status: "all" });
  const [previewPastor, setPreviewPastor] = useState<AdminPastor | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<AdminPastor | null>(null);

  const feedback =
    searchParams.get("created") === "1"
      ? "Pastor creado correctamente."
      : searchParams.get("updated") === "1"
        ? "Pastor actualizado correctamente."
        : null;

  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => router.replace("/admin/pastores"), 4000);
    return () => clearTimeout(timeout);
  }, [feedback, router]);

  const rows = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return [...pastors]
      .filter((pastor) => filters.status === "all" || pastor.status === filters.status)
      .filter(
        (pastor) =>
          !query || pastor.name.toLowerCase().includes(query) || pastor.role.toLowerCase().includes(query)
      )
      .sort((a, b) => a.tier - b.tier);
  }, [pastors, filters]);

  function confirmArchive() {
    if (!archiveTarget) return;
    archivePastor(archiveTarget.id);
    setArchiveTarget(null);
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          {feedback}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900">Pastores</h2>
          <p className="mt-1 text-sm text-slate-500">
            Administra el equipo de liderazgo de New Life. {pastors.length} en total.
          </p>
        </div>
        <Button href="/admin/pastores/nuevo" variant="primary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo pastor
        </Button>
      </div>

      <PastorFilters value={filters} onChange={setFilters} />

      {isReady ? (
        <PastorTable
          pastors={rows}
          onView={setPreviewPastor}
          onEdit={(pastor) => router.push(`/admin/pastores/${pastor.id}/editar`)}
          onDuplicate={(pastor) => duplicatePastor(pastor.id)}
          onArchive={setArchiveTarget}
          onActivate={(pastor) => activatePastor(pastor.id)}
        />
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Cargando pastores…
        </p>
      )}

      <Modal
        open={previewPastor !== null}
        onClose={() => setPreviewPastor(null)}
        title="Vista previa"
        className="max-w-4xl"
      >
        {previewPastor && <PastorPreview pastor={previewPastor} />}
      </Modal>

      <ConfirmDialog
        open={archiveTarget !== null}
        onCancel={() => setArchiveTarget(null)}
        onConfirm={confirmArchive}
        title="Archivar pastor"
        confirmLabel="Archivar"
        description={
          <>
            ¿Quieres archivar a <strong className="font-semibold text-slate-900">“{archiveTarget?.name}”</strong>?
            Dejará de aparecer en el sitio público, pero podrás encontrarlo luego filtrando por estado
            «Archivado» y volver a activarlo cuando quieras.
          </>
        }
      />
    </div>
  );
}
