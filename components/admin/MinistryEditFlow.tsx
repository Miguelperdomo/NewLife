"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ministryFormValuesToInput, ministryToFormValues } from "@/lib/admin/mappers";
import { useAdminMinistries } from "@/lib/admin/useAdminMinistries";
import type { MinistryFormValues } from "@/lib/admin/schemas";
import type { AdminMinistry } from "@/lib/admin/types";
import { MinistryForm } from "./MinistryForm";
import { MinistryPreview } from "./MinistryPreview";

function draftMinistryForPreview(values: MinistryFormValues): AdminMinistry {
  return { ...ministryFormValuesToInput(values), id: "vista-previa", createdAt: "", updatedAt: "" };
}

export function MinistryEditFlow() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { ministries, isReady, updateMinistry } = useAdminMinistries();
  const [preview, setPreview] = useState<AdminMinistry | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isReady) {
    return <p className="text-sm text-slate-500">Cargando…</p>;
  }

  const ministry = ministries.find((item) => item.id === params.id);

  if (!ministry) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        No se encontró este ministerio. Puede que ya haya sido archivado o eliminado.
      </p>
    );
  }

  async function handleSubmit(values: MinistryFormValues) {
    if (!ministry) return;
    setError(null);
    try {
      await updateMinistry(ministry.id, ministryFormValuesToInput(values));
      router.push("/admin/ministerios?updated=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar los cambios.");
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <MinistryForm
        submitLabel="Guardar cambios"
        defaultValues={ministryToFormValues(ministry)}
        onPreview={(values) => setPreview(draftMinistryForPreview(values))}
        onSubmit={handleSubmit}
      />

      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Vista previa" className="max-w-4xl">
        {preview && <MinistryPreview ministry={preview} />}
      </Modal>
    </div>
  );
}
