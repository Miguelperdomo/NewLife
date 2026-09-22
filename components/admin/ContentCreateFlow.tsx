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
  const [error, setError] = useState<string | null>(null);

  if (!type) {
    return <ContentTypePicker onSelect={setType} />;
  }

  async function handleEventSubmit(values: EventFormValues) {
    setError(null);
    try {
      await createEvent(eventFormValuesToInput(values));
      router.push("/admin/contenido");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el evento.");
    }
  }

  async function handleNewsSubmit(values: NewsFormValues) {
    setError(null);
    try {
      await createNews(newsFormValuesToInput(values));
      router.push("/admin/contenido");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la noticia.");
    }
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

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {type === "event" ? (
        <EventForm
          onPreview={(values) => setPreview({ type: "event", data: draftEventForPreview(values) })}
          onSubmit={handleEventSubmit}
        />
      ) : (
        <NewsForm
          onPreview={(values) => setPreview({ type: "news", data: draftNewsForPreview(values) })}
          onSubmit={handleNewsSubmit}
        />
      )}

      <Modal open={preview !== null} onClose={() => setPreview(null)} title="Vista previa">
        {preview && <ContentPreview item={preview} />}
      </Modal>
    </div>
  );
}
