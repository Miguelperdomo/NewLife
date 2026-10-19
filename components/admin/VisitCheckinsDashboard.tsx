"use client";

import { useEffect, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RefreshButton } from "./RefreshButton";
import { loadVisitCheckins, removeVisitCheckins, setVisitCheckinStatus } from "@/lib/admin/visitCheckins";
import type { AdminVisitCheckin } from "@/lib/admin/types";

const dateFormatter = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "2-digit", month: "long" });

function formatVisitDate(iso: string): string {
  const label = dateFormatter.format(new Date(`${iso}T00:00:00`));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function VisitCheckinsDashboard() {
  const [entries, setEntries] = useState<AdminVisitCheckin[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadVisitCheckins().then((loaded) => {
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
    const loaded = await loadVisitCheckins();
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

  async function toggleStatus(entry: AdminVisitCheckin) {
    setUpdatingId(entry.id);
    setError(null);
    try {
      const nextStatus = entry.status === "nueva" ? "atendida" : "nueva";
      await setVisitCheckinStatus(entry.id, nextStatus);
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
      await removeVisitCheckins(Array.from(checked));
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-slate-900">Primera visita</h2>
            <RefreshButton onClick={refresh} refreshing={refreshing} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {pendingCount > 0 ? `${pendingCount} por recibir · ` : ""}
            Quiénes avisaron que van a venir — ordenado por fecha de visita, la más próxima primero.
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
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Cargando…
        </p>
      ) : entries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Todavía nadie ha avisado que viene.
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
            {entries.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3 sm:flex-1 sm:min-w-0">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 rounded"
                    checked={checked.has(entry.id)}
                    onChange={() => toggleOne(entry.id)}
                    aria-label={`Seleccionar visita de ${entry.name}`}
                  />
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{entry.name}</p>
                      <span
                        className={
                          entry.status === "nueva"
                            ? "rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700"
                            : "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"
                        }
                      >
                        {entry.status === "nueva" ? "Por recibir" : "Atendida"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      {entry.peopleCount} persona{entry.peopleCount === 1 ? "" : "s"} · {entry.campus}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{formatVisitDate(entry.visitDate)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="shrink-0 self-start border border-slate-200 text-xs sm:self-center"
                  disabled={updatingId === entry.id}
                  onClick={() => toggleStatus(entry)}
                >
                  {entry.status === "nueva" ? "Marcar atendida" : "Marcar nueva"}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar avisos de primera visita"
        confirmLabel={deleting ? "Eliminando…" : "Eliminar"}
        description={
          <>
            ¿Eliminar {checked.size} aviso{checked.size === 1 ? "" : "s"} de primera visita? Esta acción no se puede
            deshacer.
          </>
        }
      />
    </div>
  );
}
