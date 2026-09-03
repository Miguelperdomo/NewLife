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

  return (
    <div>
      <CampusForm
        onPreview={(values) => setPreview(draftCampusForPreview(values))}
        onSubmit={(values) => {
          createCampus(campusFormValuesToInput(values));
          router.push("/admin/sedes");
        }}
      />

      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Vista previa">
        {preview && <CampusPreview campus={preview} />}
      </Modal>
    </div>
  );
}
