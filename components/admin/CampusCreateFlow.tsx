"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { campusFormValuesToInput } from "@/lib/admin/mappers";
import { useAdminCampuses } from "@/lib/admin/useAdminCampuses";
import type { CampusFormValues } from "@/lib/admin/schemas";
import type { AdminCampus } from "@/lib/admin/types";
import { CampusForm } from "./CampusForm";
import { CampusPreview } from "./CampusPreview";

function draftCampusForPreview(values: CampusFormValues): AdminCampus {
  return { ...campusFormValuesToInput(values), id: "vista-previa", slug: "", createdAt: "", updatedAt: "" };
}

export function CampusCreateFlow() {
  const router = useRouter();
  const { createCampus } = useAdminCampuses();
  const [preview, setPreview] = useState<AdminCampus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: CampusFormValues) {
    setError(null);
    try {
      await createCampus(campusFormValuesToInput(values));
      router.push("/admin/sedes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la sede.");
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <CampusForm onPreview={(values) => setPreview(draftCampusForPreview(values))} onSubmit={handleSubmit} />

      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Vista previa">
        {preview && <CampusPreview campus={preview} />}
      </Modal>
    </div>
  );
}
