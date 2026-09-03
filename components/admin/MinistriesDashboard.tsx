"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { useAdminMinistries } from "@/lib/admin/useAdminMinistries";
import type { AdminMinistry } from "@/lib/admin/types";
import { MinistryFilters, type MinistryFiltersValue } from "./MinistryFilters";
import { MinistryPreview } from "./MinistryPreview";
import { MinistryTable } from "./MinistryTable";

export function MinistriesDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ministries, isReady, duplicateMinistry, archiveMinistry, activateMinistry } = useAdminMinistries();
  const [filters, setFilters] = useState<MinistryFiltersValue>({ query: "", status: "all" });
  const [previewMinistry, setPreviewMinistry] = useState<AdminMinistry | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<AdminMinistry | null>(null);

  const feedback =
    searchParams.get("created") === "1"
      ? "Ministerio creado correctamente."
      : searchParams.get("updated") === "1"
        ? "Ministerio actualizado correctamente."
        : null;

  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => router.replace("/admin/ministerios"), 4000);
    return () => clearTimeout(timeout);
  }, [feedback, router]);

  const rows = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return [...ministries]
      .filter((ministry) => filters.status === "all" || ministry.status === filters.status)
      .filter(
        (ministry) =>
          !query ||
          ministry.name.toLowerCase().includes(query) ||
          ministry.shortDescription.toLowerCase().includes(query) ||
          ministry.description.toLowerCase().includes(query) ||
          (ministry.leader ?? "").toLowerCase().includes(query)
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [ministries, filters]);

  function confirmArchive() {
    if (!archiveTarget) return;
    archiveMinistry(archiveTarget.id);
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
          <h2 className="font-heading text-xl font-bold text-slate-900">Ministerios</h2>
          <p className="mt-1 text-sm text-slate-500">
            Administra los ministerios que forman parte de New Life. {ministries.length} en total.
          </p>
        </div>
        <Button href="/admin/ministerios/nuevo" variant="primary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo ministerio
        </Button>
      </div>

      <MinistryFilters value={filters} onChange={setFilters} />

      {isReady ? (
        <MinistryTable
          ministries={rows}
          onView={setPreviewMinistry}
          onEdit={(ministry) => router.push(`/admin/ministerios/${ministry.id}/editar`)}
          onDuplicate={(ministry) => duplicateMinistry(ministry.id)}
          onArchive={setArchiveTarget}
          onActivate={(ministry) => activateMinistry(ministry.id)}
        />
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Cargando ministerios…
        </p>
      )}

      <Modal
        open={previewMinistry !== null}
        onClose={() => setPreviewMinistry(null)}
        title="Vista previa"
        className="max-w-4xl"
      >
        {previewMinistry && <MinistryPreview ministry={previewMinistry} />}
      </Modal>

      <ConfirmDialog
        open={archiveTarget !== null}
        onCancel={() => setArchiveTarget(null)}
        onConfirm={confirmArchive}
        title="Archivar ministerio"
        confirmLabel="Archivar"
        description={
          <>
            ¿Quieres archivar <strong className="font-semibold text-slate-900">“{archiveTarget?.name}”</strong>?
            Dejará de aparecer en el sitio público, pero podrás encontrarlo luego filtrando por estado
            «Archivado» y volver a activarlo cuando quieras.
          </>
        }
      />
    </div>
  );
}
