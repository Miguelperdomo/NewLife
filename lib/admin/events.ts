import { createClient } from "@/lib/supabase/client";
import { slugify, uniqueSlug } from "@/lib/admin/slug";
import type { AdminEvent, MinistryAudience } from "@/lib/admin/types";

/**
 * Capa de datos de Eventos contra Supabase. Dos relaciones que el formulario
 * maneja por slug (para no tener que rediseñar la UI) pero que en la base de
 * datos son de verdad:
 *  - `campus` (slug) <-> `campus_id` (uuid, FK a campuses.id) — mismo patrón
 *    que "pastor responsable" en lib/admin/campuses.ts.
 *  - `audience` (todos / algunos ministerios / general) <-> `applies_to_all_ministries`
 *    + filas en `event_ministries` (N:N). Sin filas = "general".
 *
 * El slug NUNCA lo edita el formulario (a diferencia de Ministerios/Pastores)
 * — se genera solo al crear y no vuelve a tocarse, igual que en el hook
 * anterior basado en localStorage.
 */
interface EventRow {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  category: string | null;
  image_url: string | null;
  status: "draft" | "published" | "scheduled" | "archived";
  publish_at: string | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  applies_to_all_ministries: boolean;
  registration_url: string | null;
  whatsapp_number: string | null;
  capacity: number | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  campus: { slug: string } | null;
  event_ministries: { ministry: { slug: string } | null }[];
}

const SELECT_COLUMNS =
  "id, slug, title, short_description, description, category, image_url, status, publish_at, start_date, end_date, start_time, end_time, location, applies_to_all_ministries, registration_url, whatsapp_number, capacity, featured, created_at, updated_at, campus:campuses(slug), event_ministries(ministry:ministries(slug))";

function rowToEvent(row: EventRow): AdminEvent {
  const ministrySlugs = (row.event_ministries ?? [])
    .map((item) => item.ministry?.slug)
    .filter((slug): slug is string => Boolean(slug));

  const audience: MinistryAudience = row.applies_to_all_ministries
    ? { mode: "all" }
    : ministrySlugs.length > 0
      ? { mode: "specific", ministrySlugs }
      : { mode: "general" };

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    category: row.category ?? undefined,
    imageSrc: row.image_url ?? undefined,
    status: row.status,
    publishAt: row.publish_at ?? undefined,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    startTime: row.start_time ?? undefined,
    endTime: row.end_time ?? undefined,
    campus: row.campus?.slug,
    location: row.location ?? undefined,
    audience,
    registrationUrl: row.registration_url ?? undefined,
    whatsappNumber: row.whatsapp_number ?? undefined,
    capacity: row.capacity ?? undefined,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function resolveCampusId(slug?: string) {
  if (!slug) return null;
  const supabase = createClient();
  const { data } = await supabase.from("campuses").select("id").eq("slug", slug).maybeSingle();
  return (data as { id: string } | null)?.id ?? null;
}

async function resolveMinistryIds(slugs: string[]): Promise<string[]> {
  if (slugs.length === 0) return [];
  const supabase = createClient();
  const { data } = await supabase.from("ministries").select("id").in("slug", slugs);
  return ((data as { id: string }[] | null) ?? []).map((row) => row.id);
}

/** Reemplaza por completo las filas de event_ministries de un evento según su audiencia actual. */
async function syncEventMinistries(eventId: string, audience: MinistryAudience) {
  const supabase = createClient();
  await supabase.from("event_ministries").delete().eq("event_id", eventId);

  if (audience.mode === "specific" && audience.ministrySlugs.length > 0) {
    const ministryIds = await resolveMinistryIds(audience.ministrySlugs);
    if (ministryIds.length > 0) {
      await supabase
        .from("event_ministries")
        .insert(ministryIds.map((ministry_id) => ({ event_id: eventId, ministry_id })));
    }
  }
}

async function fetchEventById(id: string): Promise<AdminEvent> {
  const supabase = createClient();
  const { data, error } = await supabase.from("events").select(SELECT_COLUMNS).eq("id", id).single();
  if (error || !data) throw new Error(error?.message ?? "No se pudo leer el evento.");
  return rowToEvent(data as unknown as EventRow);
}

export async function loadEvents(): Promise<AdminEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select(SELECT_COLUMNS)
    .order("start_date", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as EventRow[]).map(rowToEvent);
}

type NewEventInput = Omit<AdminEvent, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };

export async function createEvent(input: NewEventInput, existingSlugs: string[]): Promise<AdminEvent> {
  const supabase = createClient();
  const slug = uniqueSlug(input.slug || slugify(input.title), existingSlugs, "evento");
  const campusId = await resolveCampusId(input.campus);

  const { data, error } = await supabase
    .from("events")
    .insert({
      slug,
      title: input.title,
      short_description: input.shortDescription,
      description: input.description,
      category: input.category || null,
      image_url: input.imageSrc || null,
      status: input.status,
      publish_at: input.publishAt || null,
      start_date: input.startDate,
      end_date: input.endDate || null,
      start_time: input.startTime || null,
      end_time: input.endTime || null,
      campus_id: campusId,
      location: input.location || null,
      applies_to_all_ministries: input.audience.mode === "all",
      registration_mode: input.registrationUrl ? "url" : "whatsapp",
      registration_url: input.registrationUrl || null,
      whatsapp_number: input.whatsappNumber || null,
      capacity: input.capacity ?? null,
      featured: input.featured ?? false,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo crear el evento.");

  await syncEventMinistries(data.id, input.audience);
  return fetchEventById(data.id);
}

export async function updateEvent(id: string, input: Partial<AdminEvent>): Promise<AdminEvent> {
  const supabase = createClient();

  // Sin condicionales "si viene definido" para los campos opcionales: en la
  // práctica este método siempre se llama con el formulario completo (ver
  // ContentEditFlow), y un campo que el usuario deja vacío se convierte en
  // `undefined` en lib/admin/mappers.ts (orUndefined) — con un filtro
  // `!== undefined` eso nunca se borraba en la base de datos aunque en
  // pantalla se viera vacío (ej. quitar la sede de un evento).
  const patch: Record<string, unknown> = {
    title: input.title,
    short_description: input.shortDescription,
    description: input.description,
    category: input.category || null,
    image_url: input.imageSrc || null,
    status: input.status,
    publish_at: input.publishAt || null,
    start_date: input.startDate,
    end_date: input.endDate || null,
    start_time: input.startTime || null,
    end_time: input.endTime || null,
    location: input.location || null,
    whatsapp_number: input.whatsappNumber || null,
    capacity: input.capacity ?? null,
    featured: input.featured ?? false,
    registration_url: input.registrationUrl || null,
    registration_mode: input.registrationUrl ? "url" : "whatsapp",
    campus_id: await resolveCampusId(input.campus),
  };
  if (input.audience !== undefined) patch.applies_to_all_ministries = input.audience.mode === "all";

  const { error } = await supabase.from("events").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  if (input.audience !== undefined) {
    await syncEventMinistries(id, input.audience);
  }

  return fetchEventById(id);
}

export async function duplicateEvent(event: AdminEvent, existingSlugs: string[]): Promise<AdminEvent> {
  const supabase = createClient();
  const slug = uniqueSlug(`${event.slug}-copia`, existingSlugs, "evento");
  const campusId = await resolveCampusId(event.campus);

  const { data, error } = await supabase
    .from("events")
    .insert({
      slug,
      title: `${event.title} (copia)`,
      short_description: event.shortDescription,
      description: event.description,
      category: event.category || null,
      image_url: event.imageSrc || null,
      // Sin estado "draft" propio distinto al de eventos/noticias normales:
      // una copia recién creada arranca en borrador, igual que en el store anterior.
      status: "draft",
      publish_at: null,
      start_date: event.startDate,
      end_date: event.endDate || null,
      start_time: event.startTime || null,
      end_time: event.endTime || null,
      campus_id: campusId,
      location: event.location || null,
      applies_to_all_ministries: event.audience.mode === "all",
      registration_mode: event.registrationUrl ? "url" : "whatsapp",
      registration_url: event.registrationUrl || null,
      whatsapp_number: event.whatsappNumber || null,
      capacity: event.capacity ?? null,
      featured: event.featured ?? false,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo duplicar el evento.");

  await syncEventMinistries(data.id, event.audience);
  return fetchEventById(data.id);
}

export async function setEventStatus(
  id: string,
  status: "draft" | "published" | "scheduled" | "archived"
): Promise<AdminEvent> {
  const supabase = createClient();
  const { error } = await supabase.from("events").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  return fetchEventById(id);
}
