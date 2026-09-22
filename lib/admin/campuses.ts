import { createClient } from "@/lib/supabase/client";
import { slugify, uniqueSlug } from "@/lib/admin/slug";
import type { AdminCampus, AdminServiceSchedule } from "@/lib/admin/types";

/**
 * Capa de datos de Sedes contra Supabase (tabla `campuses`). `leadPastorSlug`
 * es solo la forma que usa el formulario (dropdown por slug, igual que
 * antes) — en la base de datos la relación real es `lead_pastor_id` (FK a
 * `pastors.id`), así que aquí se resuelve slug -> id al guardar y se trae
 * de vuelta vía el embed `pastor:pastors(slug)` al leer. Mientras el módulo
 * de Pastores no esté migrado a Supabase (próximo paso), esa resolución no
 * encuentra ningún pastor y el campo queda vacío — no rompe nada, empieza a
 * funcionar solo en cuanto Pastores tenga sus propias filas.
 */
interface ScheduleRow {
  day_of_week: number;
  service_time: string;
  title: string;
  description: string | null;
  display_order: number;
}

interface CampusRow {
  id: string;
  slug: string;
  name: string;
  full_name: string;
  address: string;
  map_query: string;
  image_url: string | null;
  is_main: boolean;
  lead_pastor_id: string | null;
  whatsapp_number: string | null;
  created_at: string;
  updated_at: string;
  pastor: { slug: string } | null;
  campus_service_schedules: ScheduleRow[];
}

const SELECT_COLUMNS =
  "*, pastor:pastors(slug), campus_service_schedules(day_of_week, service_time, title, description, display_order)";

function rowToCampus(row: CampusRow): AdminCampus {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    fullName: row.full_name,
    address: row.address,
    mapQuery: row.map_query,
    imageSrc: row.image_url ?? undefined,
    isMain: row.is_main,
    leadPastorSlug: row.pastor?.slug ?? undefined,
    whatsappNumber: row.whatsapp_number ?? undefined,
    schedules: (row.campus_service_schedules ?? [])
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((schedule) => ({
        // service_time viene de Postgres como "HH:MM:SS" — se recorta a "HH:MM" para que calce con <input type="time">.
        dayOfWeek: schedule.day_of_week,
        time: schedule.service_time.slice(0, 5),
        title: schedule.title,
        description: schedule.description ?? undefined,
      })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Reemplaza por completo los horarios de una sede — mismo patrón que syncEventMinistries. */
async function syncCampusSchedules(campusId: string, schedules: AdminServiceSchedule[]) {
  const supabase = createClient();
  await supabase.from("campus_service_schedules").delete().eq("campus_id", campusId);

  if (schedules.length > 0) {
    await supabase.from("campus_service_schedules").insert(
      schedules.map((schedule, index) => ({
        campus_id: campusId,
        day_of_week: schedule.dayOfWeek,
        service_time: schedule.time,
        title: schedule.title,
        description: schedule.description ?? null,
        display_order: index,
      }))
    );
  }
}

async function resolvePastorId(slug: string | undefined) {
  if (!slug) return null;
  const supabase = createClient();
  const { data } = await supabase.from("pastors").select("id").eq("slug", slug).maybeSingle();
  return (data as { id: string } | null)?.id ?? null;
}

async function fetchCampusById(id: string): Promise<AdminCampus> {
  const supabase = createClient();
  const { data, error } = await supabase.from("campuses").select(SELECT_COLUMNS).eq("id", id).single();
  if (error || !data) throw new Error(error?.message ?? "No se pudo leer la sede.");
  return rowToCampus(data as unknown as CampusRow);
}

export async function loadCampuses(): Promise<AdminCampus[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("campuses")
    .select(SELECT_COLUMNS)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as CampusRow[]).map(rowToCampus);
}

type NewCampusInput = Omit<AdminCampus, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };

export async function createCampus(input: NewCampusInput, existingSlugs: string[]): Promise<AdminCampus> {
  const supabase = createClient();
  const slug = uniqueSlug(input.slug || slugify(input.name), existingSlugs, "sede");
  const leadPastorId = await resolvePastorId(input.leadPastorSlug);

  // Solo puede haber una sede principal — se desmarca cualquier otra ANTES
  // de insertar esta, porque el índice único de la base de datos no permite
  // dos filas con is_main = true al mismo tiempo, ni un instante.
  if (input.isMain) {
    await supabase.from("campuses").update({ is_main: false }).eq("is_main", true);
  }

  const { data, error } = await supabase
    .from("campuses")
    .insert({
      slug,
      name: input.name,
      full_name: input.fullName,
      address: input.address,
      map_query: input.mapQuery,
      image_url: input.imageSrc || null,
      is_main: input.isMain ?? false,
      lead_pastor_id: leadPastorId,
      whatsapp_number: input.whatsappNumber || null,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo crear la sede.");
  await syncCampusSchedules(data.id, input.schedules);
  return fetchCampusById(data.id);
}

export async function updateCampus(id: string, input: Partial<AdminCampus>): Promise<AdminCampus> {
  const supabase = createClient();

  if (input.isMain) {
    await supabase.from("campuses").update({ is_main: false }).eq("is_main", true).neq("id", id);
  }

  // Sin condicionales "si viene definido": en la práctica este método
  // siempre se llama con el formulario completo (ver CampusEditFlow), así
  // que usar `!== undefined` como filtro tenía un bug real — un campo
  // opcional que el usuario deja vacío se convierte en `undefined` en
  // lib/admin/mappers.ts (orUndefined), y con el filtro antiguo eso hacía
  // que ese campo NUNCA se borrara en la base de datos, aunque en pantalla
  // se viera vacío. Escribir siempre todos los campos es lo correcto aquí.
  const patch: Record<string, unknown> = {
    name: input.name,
    full_name: input.fullName,
    address: input.address,
    map_query: input.mapQuery,
    image_url: input.imageSrc || null,
    is_main: input.isMain ?? false,
    whatsapp_number: input.whatsappNumber || null,
    lead_pastor_id: await resolvePastorId(input.leadPastorSlug),
  };

  const { error } = await supabase.from("campuses").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  await syncCampusSchedules(id, input.schedules ?? []);
  return fetchCampusById(id);
}

export async function removeCampus(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("campuses").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
