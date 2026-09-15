"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ministryFormValuesToInput } from "@/lib/admin/mappers";
import { useAdminMinistries } from "@/lib/admin/useAdminMinistries";
import type { MinistryFormValues } from "@/lib/admin/schemas";
import type { AdminMinistry } from "@/lib/admin/types";
import { MinistryForm } from "./MinistryForm";
import { MinistryPreview } from "./MinistryPreview";

function draftMinistryForPreview(values: MinistryFormValues): AdminMinistry {
  return { ...ministryFormValuesToInput(values), id: "vista-previa", createdAt: "", updatedAt: "" };
}

export function MinistryCreateFlow() {
  const router = useRouter();
  const { createMinistry } = useAdminMinistries();
  const [preview, setPreview] = useState<AdminMinistry | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: MinistryFormValues) {
    setError(null);
    try {
      await createMinistry(ministryFormValuesToInput(values));
      router.push("/admin/ministerios?created=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el ministerio.");
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <MinistryForm onPreview={(values) => setPreview(draftMinistryForPreview(values))} onSubmit={handleSubmit} />

      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Vista previa" className="max-w-4xl">
        {preview && <MinistryPreview ministry={preview} />}
      </Modal>
    </div>
  );
}
