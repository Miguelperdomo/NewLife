"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Download, RefreshCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { adminSiteSettingsSchema } from "@/lib/admin/schemas";
import type { AdminSiteSettings } from "@/lib/admin/types";

type PendingAction = "reset" | { type: "import"; data: AdminSiteSettings } | null;

/** Acciones de Configuración: exportar, importar o restablecer a los valores demo. */
export function SystemPanel({
  settings,
  onResetDemo,
  onImport,
}: {
  settings: AdminSiteSettings;
  onResetDemo: () => Promise<AdminSiteSettings>;
  onImport: (data: AdminSiteSettings) => Promise<void>;
}) {
  const [pending, setPending] = useState<PendingAction>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "newlife-configuracion.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const rawParsed: unknown = JSON.parse(String(reader.result));
        // Valida la forma real antes de dejarla llegar a Supabase — un JSON
        // dañado o manipulado a mano ya no se guarda tal cual.
        const parsed = adminSiteSettingsSchema.parse(rawParsed) as AdminSiteSettings;
        setImportError(null);
        setPending({ type: "import", data: parsed });
      } catch {
        setImportError("El archivo no tiene el formato correcto de una configuración de New Life.");
      }
    };
    reader.readAsText(file);
  }

  async function handleConfirm() {
    if (pending === "reset") {
      await onResetDemo();
    } else if (pending && typeof pending === "object") {
      await onImport(pending.data);
    }
    setPending(null);
  }

  const dialogCopy =
    pending === "reset"
      ? {
          title: "Restablecer configuración demo",
          confirmLabel: "Restablecer",
          description:
            "¿Restablecer la configuración a los valores demo? Se perderán los cambios que hayas guardado aquí.",
        }
      : pending
        ? {
            title: "Importar configuración",
            confirmLabel: "Importar",
            description: "¿Reemplazar la configuración actual con el contenido de este archivo?",
          }
        : null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-heading text-lg font-bold text-slate-900">Sistema</h3>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="ghost"
          className="border border-red-200 text-red-700 hover:bg-red-100"
          onClick={() => setPending("reset")}
        >
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
          Restablecer contenido demo
        </Button>
        <Button type="button" variant="ghost" className="border border-slate-200" onClick={handleExport}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Exportar configuración
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="border border-slate-200"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Importar configuración
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Importar archivo de configuración"
        />
      </div>
      {importError && <p className="mt-2 text-xs font-medium text-red-600">{importError}</p>}

      <ConfirmDialog
        open={dialogCopy !== null}
        onCancel={() => setPending(null)}
        onConfirm={handleConfirm}
        title={dialogCopy?.title ?? ""}
        confirmLabel={dialogCopy?.confirmLabel ?? "Confirmar"}
        description={dialogCopy?.description ?? ""}
      />
    </section>
  );
}
