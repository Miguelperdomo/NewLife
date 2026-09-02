"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  eventFormValuesToInput,
  eventToFormValues,
  newsFormValuesToInput,
  newsToFormValues,
} from "@/lib/admin/mappers";
import { useAdminContent } from "@/lib/admin/useAdminContent";
import type { EventFormValues, NewsFormValues } from "@/lib/admin/schemas";
import type { AdminEvent, AdminNews } from "@/lib/admin/types";
import { ContentPreview } from "./ContentPreview";
import { EventForm } from "./EventForm";
import { NewsForm } from "./NewsForm";

function draftEventForPreview(values: EventFormValues): AdminEvent {
  return { ...eventFormValuesToInput(values), id: "vista-previa", slug: "", createdAt: "", updatedAt: "" };
}

function draftNewsForPreview(values: NewsFormValues): AdminNews {
  return { ...newsFormValuesToInput(values), id: "vista-previa", slug: "", createdAt: "", updatedAt: "" };
}

export function ContentEditFlow() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") === "news" ? "news" : "event";
  const { events, news, isReady, updateEvent, updateNews } = useAdminContent();
  const [preview, setPreview] = useState<
    { type: "event"; data: AdminEvent } | { type: "news"; data: AdminNews } | null
  >(null);

  if (!isReady) {
    return <p className="text-sm text-slate-500">Cargando…</p>;
  }

  const event = type === "event" ? events.find((item) => item.id === params.id) : undefined;
  const article = type === "news" ? news.find((item) => item.id === params.id) : undefined;

  if ((type === "event" && !event) || (type === "news" && !article)) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        No se encontró este contenido. Puede que ya haya sido archivado o eliminado.
      </p>
    );
  }

  return (
    <div>
      {type === "event" && event && (
        <EventForm
          submitLabel="Guardar cambios"
          defaultValues={eventToFormValues(event)}
          onPreview={(values) => setPreview({ type: "event", data: draftEventForPreview(values) })}
          onSubmit={(values) => {
            updateEvent(event.id, eventFormValuesToInput(values));
            router.push("/admin/contenido");
          }}
        />
      )}
      {type === "news" && article && (
        <NewsForm
          submitLabel="Guardar cambios"
          defaultValues={newsToFormValues(article)}
          onPreview={(values) => setPreview({ type: "news", data: draftNewsForPreview(values) })}
          onSubmit={(values) => {
            updateNews(article.id, newsFormValuesToInput(values));
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
