"use client";

import { useEffect, useState } from "react";
import { Download, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { loadActivityLog, loadActivityLogForExport, removeActivityLogEntries } from "@/lib/admin/activityLog";
import type { AdminActivityLogEntry } from "@/lib/admin/types";
import { inputClass } from "./form/FormField";
import { RefreshButton } from "./RefreshButton";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "justo ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

const fullDateFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "full",
  timeStyle: "short",
});

function fullDate(iso: string): string {
  return fullDateFormatter.format(new Date(iso));
}

function csvField(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function buildActivityCsv(entries: AdminActivityLogEntry[]): string {
  const header = ["Fecha y hora", "Administrador", "Acción", "Detalle"];
  const rows = entries.map((entry) => {
    const detail = entry.details
      ? Object.entries(entry.details)
          .map(([label, value]) => `${label}: ${value}`)
          .join(" | ")
      : "";
    return [fullDate(entry.createdAt), entry.adminName, entry.summary, detail].map(csvField).join(",");
  });
  // ﻿ al inicio para que Excel detecte UTF-8 y muestre bien tildes/ñ.
  return "﻿" + [header.join(","), ...rows].join("\n");
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function ActivityDetailModal({
  entry,
  onClose,
}: {
  entry: AdminActivityLogEntry | null;
  onClose: () => void;
}) {
  return (
    <Modal open={entry !== null} onClose={onClose} title="Detalle de la acción">
      {entry && (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{entry.adminName}</span> {entry.summary}
            </p>
            <p className="mt-1 text-xs text-slate-400">{fullDate(entry.createdAt)}</p>
          </div>

          {entry.details && Object.keys(entry.details).length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(entry.details).map(([label, value]) => (
                    <tr key={label} className="align-top">
                      <th className="w-40 shrink-0 bg-slate-50 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                      </th>
                      <td className="whitespace-pre-wrap px-3 py-2.5 text-slate-700">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
              Esta acción no tiene campos de detalle guardados (ej. solo cambió el estado, ya descrito arriba).
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}

export function ActivityLogDashboard() {
  const [entries, setEntries] = useState<AdminActivityLogEntry[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [selected, setSelected] = useState<AdminActivityLogEntry | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");
  const [exportAdmin, setExportAdmin] = useState("");
  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadActivityLog().then((loaded) => {
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
    const loaded = await loadActivityLog();
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

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      const rows = await loadActivityLogForExport({
        from: exportFrom || undefined,
        to: exportTo || undefined,
        adminName: exportAdmin.trim() || undefined,
      });
      if (rows.length === 0) {
        setError("No hay actividad que coincida con esos filtros para exportar.");
        return;
      }
      downloadCsv(`actividad-newlife-${new Date().toISOString().slice(0, 10)}.csv`, buildActivityCsv(rows));
    } catch {
      setError("No se pudo generar el archivo de exportación.");
    } finally {
      setExporting(false);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    setError(null);
    try {
      await removeActivityLogEntries(Array.from(checked));
      setEntries((current) => current.filter((entry) => !checked.has(entry.id)));
      setChecked(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron eliminar los registros.");
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-slate-900">Actividad</h2>
            <RefreshButton onClick={refresh} refreshing={refreshing} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Qué ha hecho cada usuario en el panel — últimos {entries.length ? entries.length : "50"} cambios, más
            reciente primero. Haz clic en uno para ver el informe completo.
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

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div>
          <label htmlFor="exportFrom" className="mb-1 block text-xs font-semibold text-slate-500">
            Desde
          </label>
          <input
            id="exportFrom"
            type="date"
            className={inputClass}
            value={exportFrom}
            onChange={(event) => setExportFrom(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="exportTo" className="mb-1 block text-xs font-semibold text-slate-500">
            Hasta
          </label>
          <input
            id="exportTo"
            type="date"
            className={inputClass}
            value={exportTo}
            onChange={(event) => setExportTo(event.target.value)}
          />
        </div>
        <div className="flex-1 sm:min-w-[160px]">
          <label htmlFor="exportAdmin" className="mb-1 block text-xs font-semibold text-slate-500">
            Administrador
          </label>
          <input
            id="exportAdmin"
            type="text"
            placeholder="Todos"
            className={inputClass}
            value={exportAdmin}
            onChange={(event) => setExportAdmin(event.target.value)}
          />
        </div>
        <Button variant="ghost" className="border border-slate-200" onClick={handleExport} disabled={exporting}>
          <Download className="h-4 w-4" aria-hidden="true" />
          {exporting ? "Generando…" : "Exportar a Excel"}
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!isReady ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Cargando…
        </p>
      ) : entries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Todavía no hay actividad registrada.
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
              <li key={entry.id} className="flex items-start gap-3 p-4">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 rounded"
                  checked={checked.has(entry.id)}
                  onChange={() => toggleOne(entry.id)}
                  aria-label={`Seleccionar registro de ${entry.adminName}`}
                />
                <button type="button" onClick={() => setSelected(entry)} className="flex min-w-0 flex-1 items-start gap-3 text-left">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <History className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{entry.adminName}</span> {entry.summary}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {timeAgo(entry.createdAt)} · {fullDate(entry.createdAt)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ActivityDetailModal entry={selected} onClose={() => setSelected(null)} />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar actividad"
        confirmLabel={deleting ? "Eliminando…" : "Eliminar"}
        description={
          <>
            ¿Eliminar {checked.size} registro{checked.size === 1 ? "" : "s"} de actividad? Esta acción no se puede
            deshacer.
          </>
        }
      />
    </div>
  );
}
