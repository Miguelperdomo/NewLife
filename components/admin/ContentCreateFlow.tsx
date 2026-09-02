"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { eventFormValuesToInput, newsFormValuesToInput } from "@/lib/admin/mappers";
import { useAdminContent } from "@/lib/admin/useAdminContent";
import type { EventFormValues, NewsFormValues } from "@/lib/admin/schemas";
import type { AdminContentType, AdminEvent, AdminNews } from "@/lib/admin/types";
import { ContentPreview } from "./ContentPreview";
import { ContentTypePicker } from "./ContentTypePicker";
import { EventForm } from "./EventForm";
import { NewsForm } from "./NewsForm";

function draftEventForPreview(values: EventFormValues): AdminEvent {
  return { ...eventFormValuesToInput(values), id: "vista-previa", slug: "", createdAt: "", updatedAt: "" };
}

function draftNewsForPreview(values: NewsFormValues): AdminNews {
  return { ...newsFormValuesToInput(values), id: "vista-previa", slug: "", createdAt: "", updatedAt: "" };
}

function initialType(value: string | null): AdminContentType | null {
  return value === "event" || value === "news" ? value : null;
}

export function ContentCreateFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createEvent, createNews } = useAdminContent();
  const [type, setType] = useState<AdminContentType | null>(() => initialType(searchParams.get("type")));
  const [preview, setPreview] = useState<
    { type: "event"; data: AdminEvent } | { type: "news"; data: AdminNews } | null
  >(null);

  if (!type) {
    return <ContentTypePicker onSelect={setType} />;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setType(null)}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Cambiar tipo de contenido
      </button>

      {type === "event" ? (
        <EventForm
          onPreview={(values) => setPreview({ type: "event", data: draftEventForPreview(values) })}
          onSubmit={(values) => {
            createEvent(eventFormValuesToInput(values));
            router.push("/admin/contenido");
          }}
        />
      ) : (
        <NewsForm
          onPreview={(values) => setPreview({ type: "news", data: draftNewsForPreview(values) })}
          onSubmit={(values) => {
            createNews(newsFormValuesToInput(values));
            router.push("/admin/contenido");
          }}
        />
      )}

      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Vista previa">
        {preview && <ContentPreview item={preview} />}
      </Modal>
    </div>
  );
}
