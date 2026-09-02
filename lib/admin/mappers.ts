import type { EventFormValues, NewsFormValues } from "@/lib/admin/schemas";
import type { AdminEvent, AdminNews } from "@/lib/admin/types";

type NewEventInput = Omit<AdminEvent, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };
type NewNewsInput = Omit<AdminNews, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };

function orUndefined(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Convierte los valores del formulario (todos strings) a la forma que guarda el store. */
export function eventFormValuesToInput(values: EventFormValues): NewEventInput {
  return {
    title: values.title,
    description: values.description,
    imageSrc: orUndefined(values.imageSrc),
    status: values.status,
    publishAt: orUndefined(values.publishAt),
    startDate: values.startDate,
    endDate: orUndefined(values.endDate),
    startTime: orUndefined(values.startTime),
    endTime: orUndefined(values.endTime),
    campus: orUndefined(values.campus),
    location: orUndefined(values.location),
    audience: values.audience,
    registrationUrl: orUndefined(values.registrationUrl),
    whatsappNumber: orUndefined(values.whatsappNumber),
    capacity: values.capacity ? Number(values.capacity) : undefined,
    featured: values.featured,
  };
}

/** Inverso de eventFormValuesToInput: precarga el formulario al editar un evento existente. */
export function eventToFormValues(event: AdminEvent): EventFormValues {
  return {
    title: event.title,
    description: event.description,
    imageSrc: event.imageSrc ?? "",
    status: event.status,
    publishAt: event.publishAt ?? "",
    startDate: event.startDate,
    endDate: event.endDate ?? "",
    startTime: event.startTime ?? "",
    endTime: event.endTime ?? "",
    campus: event.campus ?? "",
    location: event.location ?? "",
    audience: event.audience,
    registrationUrl: event.registrationUrl ?? "",
    whatsappNumber: event.whatsappNumber ?? "",
    capacity: event.capacity ? String(event.capacity) : "",
    featured: event.featured,
  };
}

export function newsToFormValues(article: AdminNews): NewsFormValues {
  return {
    title: article.title,
    summary: article.summary ?? "",
    content: article.content,
    imageSrc: article.imageSrc ?? "",
    status: article.status,
    publishAt: article.publishAt ?? "",
    publishedAt: article.publishedAt,
    author: article.author ?? "",
    category: article.category ?? "",
    featured: article.featured,
  };
}

export function newsFormValuesToInput(values: NewsFormValues): NewNewsInput {
  return {
    title: values.title,
    summary: orUndefined(values.summary),
    content: values.content,
    imageSrc: orUndefined(values.imageSrc),
    status: values.status,
    publishAt: orUndefined(values.publishAt),
    publishedAt: values.publishedAt,
    author: orUndefined(values.author),
    category: orUndefined(values.category),
    featured: values.featured,
  };
}
