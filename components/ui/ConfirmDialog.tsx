import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

/**
 * Reemplazo visual de window.confirm() — mismo lenguaje que el resto del
 * panel admin en vez del diálogo nativo del navegador.
 */
export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} className="max-w-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="ghost" className="border border-slate-200" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button type="button" variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
