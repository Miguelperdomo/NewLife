import { createClient } from "@/lib/supabase/client";
import { slugify, uniqueSlug } from "@/lib/admin/slug";
import type { AdminMinistry } from "@/lib/admin/types";

/**
 * Capa de datos de Ministerios contra Supabase (tabla `ministries`). La
 * tabla también tiene columnas `audience` y `social` (jsonb) que el
 * formulario admin todavía no expone — quedan sin tocar (null / `[]` por
 * defecto) hasta que se agregue esa parte del formulario, igual que la
 * galería/horarios de Sedes.
 */
interface MinistryRow {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  image_url: string | null;
  leader: string | null;
  whatsapp: string | null;
  meeting_schedule: string | null;
  meeting_location: string | null;
  status: "active" | "archived";
  display_order: number;
  show_publicly: boolean;
  created_at: string;
  updated_at: string;
}

const SELECT_COLUMNS =
  "id, slug, name, short_description, description, image_url, leader, whatsapp, meeting_schedule, meeting_location, status, display_order, show_publicly, created_at, updated_at";

function rowToMinistry(row: MinistryRow): AdminMinistry {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    imageSrc: row.image_url ?? undefined,
    leader: row.leader ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    meetingSchedule: row.meeting_schedule ?? undefined,
    meetingLocation: row.meeting_location ?? undefined,
    status: row.status,
    displayOrder: row.display_order,
    showPublicly: row.show_publicly,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function loadMinistries(): Promise<AdminMinistry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ministries")
    .select(SELECT_COLUMNS)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return (data as unknown as MinistryRow[]).map(rowToMinistry);
}

type NewMinistryInput = Omit<AdminMinistry, "id" | "createdAt" | "updatedAt">;

export async function createMinistry(
  input: NewMinistryInput,
  existingSlugs: string[]
): Promise<AdminMinistry> {
  const supabase = createClient();
  const slug = uniqueSlug(input.slug || slugify(input.name), existingSlugs, "ministerio");

  const { data, error } = await supabase
    .from("ministries")
    .insert({
      slug,
      name: input.name,
      short_description: input.shortDescription,
      description: input.description,
      image_url: input.imageSrc || null,
      leader: input.leader || null,
      whatsapp: input.whatsapp || null,
      meeting_schedule: input.meetingSchedule || null,
      meeting_location: input.meetingLocation || null,
      status: input.status,
      display_order: input.displayOrder,
      show_publicly: input.showPublicly,
    })
    .select(SELECT_COLUMNS)
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo crear el ministerio.");
  return rowToMinistry(data as unknown as MinistryRow);
}

export async function updateMinistry(
  id: string,
  input: Partial<AdminMinistry>,
  currentSlug: string,
  otherSlugs: string[]
): Promise<AdminMinistry> {
  const supabase = createClient();

  // Sin condicionales "si viene definido" para los campos de texto opcionales:
  // en la práctica este método siempre se llama con el formulario completo
  // (ver MinistryEditFlow), y un campo que el usuario deja vacío se convierte
  // en `undefined` en lib/admin/mappers.ts (orUndefined) — con un filtro
  // `!== undefined` eso nunca se borraba en la base de datos aunque en
  // pantalla se viera vacío. El slug es la única excepción real: si no
  // cambió, no se toca (evita pisarlo con un sufijo "-2" innecesario).
  const patch: Record<string, unknown> = {
    name: input.name,
    short_description: input.shortDescription,
    description: input.description,
    image_url: input.imageSrc || null,
    leader: input.leader || null,
    whatsapp: input.whatsapp || null,
    meeting_schedule: input.meetingSchedule || null,
    meeting_location: input.meetingLocation || null,
    status: input.status,
    display_order: input.displayOrder,
    show_publicly: input.showPublicly,
  };
  if (input.slug !== undefined && input.slug !== currentSlug) {
    patch.slug = uniqueSlug(input.slug, otherSlugs, "ministerio");
  }

  const { data, error } = await supabase
    .from("ministries")
    .update(patch)
    .eq("id", id)
    .select(SELECT_COLUMNS)
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo actualizar el ministerio.");
  return rowToMinistry(data as unknown as MinistryRow);
}

export async function duplicateMinistry(
  ministry: AdminMinistry,
  existingSlugs: string[]
): Promise<AdminMinistry> {
  const supabase = createClient();
  const slug = uniqueSlug(`${ministry.slug}-copia`, existingSlugs, "ministerio");

  const { data, error } = await supabase
    .from("ministries")
    .insert({
      slug,
      name: `${ministry.name} (copia)`,
      short_description: ministry.shortDescription,
      description: ministry.description,
      image_url: ministry.imageSrc || null,
      leader: ministry.leader || null,
      whatsapp: ministry.whatsapp || null,
      meeting_schedule: ministry.meetingSchedule || null,
      meeting_location: ministry.meetingLocation || null,
      // Sin estado "draft" en este módulo (solo active/archived) — una copia
      // recién creada arranca archivada.
      status: "archived",
      display_order: ministry.displayOrder,
      show_publicly: ministry.showPublicly,
    })
    .select(SELECT_COLUMNS)
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo duplicar el ministerio.");
  return rowToMinistry(data as unknown as MinistryRow);
}

export async function setMinistryStatus(
  id: string,
  status: "active" | "archived"
): Promise<AdminMinistry> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ministries")
    .update({ status })
    .eq("id", id)
    .select(SELECT_COLUMNS)
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo actualizar el estado.");
  return rowToMinistry(data as unknown as MinistryRow);
}
