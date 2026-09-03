"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { pastorFormValuesToInput } from "@/lib/admin/mappers";
import { useAdminPastors } from "@/lib/admin/useAdminPastors";
import type { PastorFormValues } from "@/lib/admin/schemas";
import type { AdminPastor } from "@/lib/admin/types";
import { PastorForm } from "./PastorForm";
import { PastorPreview } from "./PastorPreview";

function draftPastorForPreview(values: PastorFormValues): AdminPastor {
  return { ...pastorFormValuesToInput(values), id: "vista-previa", createdAt: "", updatedAt: "" };
}

export function PastorCreateFlow() {
  const router = useRouter();
  const { createPastor } = useAdminPastors();
  const [preview, setPreview] = useState<AdminPastor | null>(null);

  return (
    <div>
      <PastorForm
        onPreview={(values) => setPreview(draftPastorForPreview(values))}
        onSubmit={(values) => {
          createPastor(pastorFormValuesToInput(values));
          router.push("/admin/pastores?created=1");
        }}
      />

      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Vista previa" className="max-w-4xl">
        {preview && <PastorPreview pastor={preview} />}
      </Modal>
    </div>
  );
}
