"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { campusFormValuesToInput, campusToFormValues } from "@/lib/admin/mappers";
import { useAdminCampuses } from "@/lib/admin/useAdminCampuses";
import type { CampusFormValues } from "@/lib/admin/schemas";
import type { AdminCampus } from "@/lib/admin/types";
import { CampusForm } from "./CampusForm";
import { CampusPreview } from "./CampusPreview";

function draftCampusForPreview(values: CampusFormValues): AdminCampus {
  return { ...campusFormValuesToInput(values), id: "vista-previa", slug: "", createdAt: "", updatedAt: "" };
}

export function CampusEditFlow() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { campuses, isReady, updateCampus } = useAdminCampuses();
  const [preview, setPreview] = useState<AdminCampus | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isReady) {
    return <p className="text-sm text-slate-500">Cargando…</p>;
  }

  const campus = campuses.find((item) => item.id === params.id);

  if (!campus) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        No se encontró esta sede. Puede que ya haya sido eliminada.
      </p>
    );
  }

  async function handleSubmit(values: CampusFormValues) {
    if (!campus) return;
    setError(null);
    try {
      await updateCampus(campus.id, campusFormValuesToInput(values));
      router.push("/admin/sedes");
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

      <CampusForm
        submitLabel="Guardar cambios"
        defaultValues={campusToFormValues(campus)}
        onPreview={(values) => setPreview(draftCampusForPreview(values))}
        onSubmit={handleSubmit}
      />

      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Vista previa">
        {preview && <CampusPreview campus={preview} />}
      </Modal>
    </div>
  );
}
