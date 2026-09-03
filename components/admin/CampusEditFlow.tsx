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

  return (
    <div>
      <CampusForm
        submitLabel="Guardar cambios"
        defaultValues={campusToFormValues(campus)}
        onPreview={(values) => setPreview(draftCampusForPreview(values))}
        onSubmit={(values) => {
          updateCampus(campus.id, campusFormValuesToInput(values));
          router.push("/admin/sedes");
        }}
      />

      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Vista previa">
        {preview && <CampusPreview campus={preview} />}
      </Modal>
    </div>
  );
}
