import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/admin/activityLog";
import { slugify, uniqueSlug } from "@/lib/admin/slug";
import type { AdminCampus, AdminServiceSchedule } from "@/lib/admin/types";

// Capa de datos de Sedes (tabla `campuses`). leadPastorSlug es solo lo que
// usa el formulario (dropdown por slug) — en la BD la relación real es
// lead_pastor_id (FK a pastors.id), se resuelve slug -> id al guardar y se
// trae de vuelta con el embed pastor:pastors(slug) al leer. Mientras
// Pastores no esté en Supabase esto no encuentra nada y queda vacío, no rompe.
interface ScheduleRow {
  day_of_week: number;
  service_time: string;
  title: string;
  description: string | null;
  display_order: number;
  ministry: { slug: string } | null;
}

interface CampusRow {
  id: string;
  slug: string;
  name: string;
  full_name: string;
  address: string;
  city: string | null;
  map_query: string;
  image_url: string | null;
  is_main: boolean;
  lead_pastor_id: string | null;
  whatsapp_number: string | null;
  has_parking: boolean;
  is_wheelchair_accessible: boolean;
  has_childcare: boolean;
  created_at: string;
  updated_at: string;
  pastor: { slug: string } | null;
  campus_service_schedules: ScheduleRow[];
}

const SELECT_COLUMNS =
  "*, pastor:pastors(slug), campus_service_schedules(day_of_week, service_time, title, description, display_order, ministry:ministries(slug))";

function rowToCampus(row: CampusRow): AdminCampus {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    fullName: row.full_name,
    address: row.address,
    city: row.city ?? undefined,
    mapQuery: row.map_query,
    imageSrc: row.image_url ?? undefined,
    isMain: row.is_main,
    leadPastorSlug: row.pastor?.slug ?? undefined,
    whatsappNumber: row.whatsapp_number ?? undefined,
    hasParking: row.has_parking,
    isWheelchairAccessible: row.is_wheelchair_accessible,
    hasChildcare: row.has_childcare,
    schedules: (row.campus_service_schedules ?? [])
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((schedule) => ({
        dayOfWeek: schedule.day_of_week,
        // postgres devuelve "HH:MM:SS", lo recortamos para el <input type="time">
        time: schedule.service_time.slice(0, 5),
        title: schedule.title,
        description: schedule.description ?? undefined,
        ministrySlug: schedule.ministry?.slug ?? undefined,
      })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** slug -> id de ministerios pedidos (mismo patrón que resolveMinistryIds en events.ts). */
async function resolveMinistryIdsBySlug(slugs: string[]): Promise<Map<string, string>> {
  if (slugs.length === 0) return new Map();
  const supabase = createClient();
  const { data } = await supabase.from("ministries").select("id, slug").in("slug", slugs);
  return new Map(((data as { id: string; slug: string }[] | null) ?? []).map((row) => [row.slug, row.id]));
}

/** Reemplaza todos los horarios de la sede (mismo patrón que syncEventMinistries). */
async function syncCampusSchedules(campusId: string, schedules: AdminServiceSchedule[]) {
  const supabase = createClient();
  await supabase.from("campus_service_schedules").delete().eq("campus_id", campusId);

  if (schedules.length > 0) {
    const ministrySlugs = schedules.map((schedule) => schedule.ministrySlug).filter((slug): slug is string => Boolean(slug));
    const ministryIdBySlug = await resolveMinistryIdsBySlug(ministrySlugs);

    await supabase.from("campus_service_schedules").insert(
      schedules.map((schedule, index) => ({
        campus_id: campusId,
        day_of_week: schedule.dayOfWeek,
        service_time: schedule.time,
        title: schedule.title,
        description: schedule.description ?? null,
        display_order: index,
        ministry_id: schedule.ministrySlug ? (ministryIdBySlug.get(schedule.ministrySlug) ?? null) : null,
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

/** Para el informe de Actividad. */
function campusDetails(input: { name?: string; fullName?: string; address?: string; city?: string; mapQuery?: string; isMain?: boolean; whatsappNumber?: string; schedules?: AdminServiceSchedule[] }): Record<string, string | undefined> {
  return {
    "Nombre corto": input.name,
    "Nombre completo": input.fullName,
    Dirección: input.address,
    Ciudad: input.city,
    "Ubicación en Maps": input.mapQuery,
    "Sede principal": input.isMain !== undefined ? (input.isMain ? "Sí" : "No") : undefined,
    WhatsApp: input.whatsappNumber,
    Horarios: input.schedules && input.schedules.length > 0 ? String(input.schedules.length) : undefined,
  };
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

  // solo puede haber una sede principal, desmarcamos la otra ANTES de
  // insertar porque el índice único no permite dos is_main=true a la vez
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
      city: input.city || null,
      map_query: input.mapQuery,
      image_url: input.imageSrc || null,
      is_main: input.isMain ?? false,
      lead_pastor_id: leadPastorId,
      whatsapp_number: input.whatsappNumber || null,
      has_parking: input.hasParking ?? false,
      is_wheelchair_accessible: input.isWheelchairAccessible ?? false,
      has_childcare: input.hasChildcare ?? false,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo crear la sede.");
  await syncCampusSchedules(data.id, input.schedules);
  await logActivity(`creó la sede "${input.name}"`, campusDetails(input));
  return fetchCampusById(data.id);
}

export async function updateCampus(id: string, input: Partial<AdminCampus>): Promise<AdminCampus> {
  const supabase = createClient();

  if (input.isMain) {
    await supabase.from("campuses").update({ is_main: false }).eq("is_main", true).neq("id", id);
  }

  // no filtramos por "si viene definido": este método siempre recibe el
  // formulario completo, y filtrar por !== undefined tenía un bug real — un
  // campo que el usuario deja vacío llega como undefined (orUndefined en
  // mappers.ts) y con ese filtro nunca se borraba en la BD
  const patch: Record<string, unknown> = {
    name: input.name,
    full_name: input.fullName,
    address: input.address,
    city: input.city || null,
    map_query: input.mapQuery,
    image_url: input.imageSrc || null,
    is_main: input.isMain ?? false,
    whatsapp_number: input.whatsappNumber || null,
    lead_pastor_id: await resolvePastorId(input.leadPastorSlug),
    has_parking: input.hasParking ?? false,
    is_wheelchair_accessible: input.isWheelchairAccessible ?? false,
    has_childcare: input.hasChildcare ?? false,
  };

  const { error } = await supabase.from("campuses").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  await syncCampusSchedules(id, input.schedules ?? []);
  await logActivity(`editó la sede "${input.name ?? id}"`, campusDetails(input));
  return fetchCampusById(id);
}

export async function removeCampus(id: string, name?: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("campuses").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity(`eliminó la sede "${name ?? id}"`);
}
