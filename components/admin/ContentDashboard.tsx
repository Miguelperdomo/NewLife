"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { toContentRows } from "@/lib/admin/contentRows";
import { useAdminContent } from "@/lib/admin/useAdminContent";
import { getMinistries } from "@/lib/content";
import type { AdminEvent, AdminNews } from "@/lib/admin/types";
import { ContentFilters, type ContentFiltersValue } from "./ContentFilters";
import { ContentPreview } from "./ContentPreview";
import { ContentTable, type ContentRow } from "./ContentTable";

function initialTypeFilter(value: string | null): ContentFiltersValue["type"] {
  return value === "event" || value === "news" ? value : "all";
}

export function ContentDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { events, news, isReady, duplicateEvent, duplicateNews, archiveEvent, archiveNews } =
    useAdminContent();
  const ministries = useMemo(() => getMinistries(), []);
  const [filters, setFilters] = useState<ContentFiltersValue>(() => ({
    query: "",
    type: initialTypeFilter(searchParams.get("type")),
    status: "all",
  }));
  const [previewItem, setPreviewItem] = useState<
    { type: "event"; data: AdminEvent } | { type: "news"; data: AdminNews } | null
  >(null);
  const [archiveTarget, setArchiveTarget] = useState<ContentRow | null>(null);

  const rows = useMemo(() => {
    return toContentRows(events, news, ministries)
      .filter((row) => filters.type === "all" || row.type === filters.type)
      .filter((row) => filters.status === "all" || row.status === filters.status)
      .filter((row) => row.title.toLowerCase().includes(filters.query.trim().toLowerCase()))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [events, news, ministries, filters]);

  function handleView(row: ContentRow) {
    if (row.type === "event") {
      const event = events.find((item) => item.id === row.id);
      if (event) setPreviewItem({ type: "event", data: event });
    } else {
      const article = news.find((item) => item.id === row.id);
      if (article) setPreviewItem({ type: "news", data: article });
    }
  }

  function handleEdit(row: ContentRow) {
    router.push(`/admin/contenido/${row.id}/editar?type=${row.type}`);
  }

  function handleDuplicate(row: ContentRow) {
    if (row.type === "event") duplicateEvent(row.id);
    else duplicateNews(row.id);
  }

  function handleArchive(row: ContentRow) {
    setArchiveTarget(row);
  }

  function confirmArchive() {
    if (!archiveTarget) return;
    if (archiveTarget.type === "event") archiveEvent(archiveTarget.id);
    else archiveNews(archiveTarget.id);
    setArchiveTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900">Contenido</h2>
          <p className="mt-1 text-sm text-slate-500">
            Eventos y noticias de New Life. {events.length + news.length} elementos en total.
          </p>
        </div>
        <Button href="/admin/contenido/nuevo" variant="primary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Crear contenido
        </Button>
      </div>

      <ContentFilters value={filters} onChange={setFilters} />

      {isReady ? (
        <ContentTable
          rows={rows}
          onView={handleView}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
        />
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Cargando contenido…
        </p>
      )}

      <Modal
        open={previewItem !== null}
        onClose={() => setPreviewItem(null)}
        title="Vista previa"
      >
        {previewItem && (
          <>
            <ContentPreview item={previewItem} />
            <div className="mt-6 flex justify-end">
              <Link
                href={
                  previewItem.type === "event"
                    ? `/eventos/${previewItem.data.slug}`
                    : `/noticias/${previewItem.data.slug}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Abrir página pública (si ya está publicado ahí) →
              </Link>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={archiveTarget !== null}
        onCancel={() => setArchiveTarget(null)}
        onConfirm={confirmArchive}
        title="Archivar contenido"
        confirmLabel="Archivar"
        description={
          <>
            ¿Archivar <strong className="font-semibold text-slate-900">“{archiveTarget?.title}”</strong>?
            Dejará de aparecer en el sitio público, pero podrás encontrarlo luego filtrando por estado
            «Archivado».
          </>
        }
      />
    </div>
  );
}
