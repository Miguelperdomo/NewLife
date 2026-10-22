"use client";

import { useEffect, useState } from "react";
import { HandHeart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { ListSkeleton } from "./ListSkeleton";
import { RefreshButton } from "./RefreshButton";
import { loadPrayerRequests, removePrayerRequests, setPrayerRequestStatus } from "@/lib/admin/prayerRequests";
import { isOverdue, sortOverdueFirst } from "@/lib/admin/pendingStatus";
import type { AdminPrayerRequest } from "@/lib/admin/types";
import { buildWhatsAppLink, normalizeWhatsAppNumber, prayerRequestFollowUpMessage } from "@/lib/whatsapp";

const dateFormatter = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" });

// A partir de este largo, el mensaje se recorta en la lista (3 líneas) y se
// agrega "Ver más" — mensajes cortos se muestran completos, sin botón de más.
const TRUNCATE_LENGTH = 220;

function PrayerDetailModal({ entry, onClose }: { entry: AdminPrayerRequest | null; onClose: () => void }) {
  return (
    <Modal open={entry !== null} onClose={onClose} title="Pedido de oración">
      {entry && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{entry.name || "Anónimo"}</p>
          </div>
          <p className="whitespace-pre-wrap text-sm text-slate-700">{entry.message}</p>
          <p className="text-xs text-slate-400">
            {dateFormatter.format(new Date(entry.createdAt))}
            {entry.contact ? ` · ${entry.contact}` : ""}
          </p>
        </div>
      )}
    </Modal>
  );
}

export function PrayerRequestsDashboard() {
  const [entries, setEntries] = useState<AdminPrayerRequest[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<AdminPrayerRequest | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadPrayerRequests().then((loaded) => {
      if (!cancelled) {
        setEntries(loaded);
        setIsReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function refresh() {
    setRefreshing(true);
    const loaded = await loadPrayerRequests();
    setEntries(loaded);
    setRefreshing(false);
  }

  function toggleOne(id: number) {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setChecked((current) => (current.size === entries.length ? new Set() : new Set(entries.map((entry) => entry.id))));
  }

  async function toggleStatus(entry: AdminPrayerRequest) {
    const nextStatus = entry.status === "nueva" ? "atendida" : "nueva";

    // Se abre ANTES de esperar la respuesta de la base de datos — si se abre
    // después de un await, varios navegadores bloquean el pop-up por no
    // reconocerlo como reacción directa al clic.
    if (nextStatus === "atendida" && entry.contact) {
      const whatsappNumber = normalizeWhatsAppNumber(entry.contact);
      if (whatsappNumber) {
        window.open(
          buildWhatsAppLink(whatsappNumber, prayerRequestFollowUpMessage(entry.name)),
          "_blank",
          "noopener,noreferrer"
        );
      }
    }

    setUpdatingId(entry.id);
    setError(null);
    try {
      await setPrayerRequestStatus(entry.id, nextStatus);
      setEntries((current) => current.map((item) => (item.id === entry.id ? { ...item, status: nextStatus } : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    setError(null);
    try {
      await removePrayerRequests(Array.from(checked));
      setEntries((current) => current.filter((entry) => !checked.has(entry.id)));
      setChecked(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron eliminar.");
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
    }
  }

  const pendingCount = entries.filter((entry) => entry.status === "nueva").length;
  const sortedEntries = sortOverdueFirst(entries);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-slate-900">Pedidos de oración</h2>
            <RefreshButton onClick={refresh} refreshing={refreshing} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {pendingCount > 0 ? `${pendingCount} sin atender · ` : ""}
            Lo que la gente escribe en el sitio público llega aquí, de forma privada.
          </p>
        </div>

        {checked.size > 0 && (
          <Button
            variant="primary"
            className="shrink-0 bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Eliminar ({checked.size})
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
      )}

      {!isReady ? (
        <ListSkeleton />
      ) : entries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Todavía no ha llegado ningún pedido de oración.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
            <input
              type="checkbox"
              className="h-4 w-4 rounded"
              checked={checked.size === entries.length}
              onChange={toggleAll}
              aria-label="Seleccionar todos"
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {checked.size > 0 ? `${checked.size} seleccionado${checked.size === 1 ? "" : "s"}` : "Seleccionar todos"}
            </span>
          </div>

          <ul className="divide-y divide-slate-100">
            {sortedEntries.map((entry) => {
              const overdue = isOverdue(entry.createdAt, entry.status);
              return (
              <li
                key={entry.id}
                className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-start ${overdue ? "bg-red-50/60" : ""}`}
              >
                <div className="flex items-start gap-3 sm:flex-1 sm:min-w-0">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 rounded"
                    checked={checked.has(entry.id)}
                    onChange={() => toggleOne(entry.id)}
                    aria-label={`Seleccionar pedido de ${entry.name || "Anónimo"}`}
                  />
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <HandHeart className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{entry.name || "Anónimo"}</p>
                      <span
                        className={
                          overdue
                            ? "rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700"
                            : entry.status === "nueva"
                              ? "rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700"
                              : "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"
                        }
                      >
                        {overdue ? "Sin atender hace varios días" : entry.status === "nueva" ? "Nueva" : "Atendida"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-slate-700">{entry.message}</p>
                    {entry.message.length > TRUNCATE_LENGTH && (
                      <button
                        type="button"
                        onClick={() => setSelected(entry)}
                        className="mt-1 text-xs font-semibold text-brand-600 hover:underline"
                      >
                        Ver más
                      </button>
                    )}
                    <p className="mt-1.5 text-xs text-slate-400">
                      {dateFormatter.format(new Date(entry.createdAt))}
                      {entry.contact ? ` · ${entry.contact}` : ""}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="shrink-0 self-start border border-slate-200 text-xs sm:self-center"
                  disabled={updatingId === entry.id}
                  onClick={() => toggleStatus(entry)}
                  title={
                    entry.status === "nueva" && entry.contact && normalizeWhatsAppNumber(entry.contact)
                      ? "Se abrirá un chat de WhatsApp con un mensaje ya escrito"
                      : undefined
                  }
                >
                  {entry.status === "nueva" ? "Marcar atendida" : "Marcar nueva"}
                </Button>
              </li>
              );
            })}
          </ul>
        </div>
      )}

      <PrayerDetailModal entry={selected} onClose={() => setSelected(null)} />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar pedidos de oración"
        confirmLabel={deleting ? "Eliminando…" : "Eliminar"}
        description={
          <>
            ¿Eliminar {checked.size} pedido{checked.size === 1 ? "" : "s"} de oración? Esta acción no se puede deshacer.
          </>
        }
      />
    </div>
  );
}
