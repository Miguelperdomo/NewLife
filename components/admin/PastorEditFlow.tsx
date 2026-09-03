"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { pastorFormValuesToInput, pastorToFormValues } from "@/lib/admin/mappers";
import { useAdminPastors } from "@/lib/admin/useAdminPastors";
import type { PastorFormValues } from "@/lib/admin/schemas";
import type { AdminPastor } from "@/lib/admin/types";
import { PastorForm } from "./PastorForm";
import { PastorPreview } from "./PastorPreview";

function draftPastorForPreview(values: PastorFormValues): AdminPastor {
  return { ...pastorFormValuesToInput(values), id: "vista-previa", createdAt: "", updatedAt: "" };
}

export function PastorEditFlow() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { pastors, isReady, updatePastor } = useAdminPastors();
  const [preview, setPreview] = useState<AdminPastor | null>(null);

  if (!isReady) {
    return <p className="text-sm text-slate-500">Cargando…</p>;
  }

  const pastor = pastors.find((item) => item.id === params.id);

  if (!pastor) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        No se encontró este pastor. Puede que ya haya sido archivado o eliminado.
      </p>
    );
  }

  return (
    <div>
      <PastorForm
        submitLabel="Guardar cambios"
        defaultValues={pastorToFormValues(pastor)}
        onPreview={(values) => setPreview(draftPastorForPreview(values))}
        onSubmit={(values) => {
          updatePastor(pastor.id, pastorFormValuesToInput(values));
          router.push("/admin/pastores?updated=1");
        }}
      />

      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Vista previa" className="max-w-4xl">
        {preview && <PastorPreview pastor={preview} />}
      </Modal>
    </div>
  );
}
