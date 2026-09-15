import { createClient } from "@/lib/supabase/client";
import { slugify, uniqueSlug } from "@/lib/admin/slug";
import type { AdminCampus } from "@/lib/admin/types";

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
}

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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function resolvePastorId(slug: string | undefined) {
  if (!slug) return null;
  const supabase = createClient();
  const { data } = await supabase.from("pastors").select("id").eq("slug", slug).maybeSingle();
  return (data as { id: string } | null)?.id ?? null;
}

export async function loadCampuses(): Promise<AdminCampus[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("campuses")
    .select("*, pastor:pastors(slug)")
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
    .select("*, pastor:pastors(slug)")
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo crear la sede.");
  return rowToCampus(data as unknown as CampusRow);
}

export async function updateCampus(id: string, input: Partial<AdminCampus>): Promise<AdminCampus> {
  const supabase = createClient();

  if (input.isMain) {
    await supabase.from("campuses").update({ is_main: false }).eq("is_main", true).neq("id", id);
  }

  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.fullName !== undefined) patch.full_name = input.fullName;
  if (input.address !== undefined) patch.address = input.address;
  if (input.mapQuery !== undefined) patch.map_query = input.mapQuery;
  if (input.imageSrc !== undefined) patch.image_url = input.imageSrc || null;
  if (input.isMain !== undefined) patch.is_main = input.isMain;
  if (input.whatsappNumber !== undefined) patch.whatsapp_number = input.whatsappNumber || null;
  if (input.leadPastorSlug !== undefined) {
    patch.lead_pastor_id = await resolvePastorId(input.leadPastorSlug);
  }

  const { data, error } = await supabase
    .from("campuses")
    .update(patch)
    .eq("id", id)
    .select("*, pastor:pastors(slug)")
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo actualizar la sede.");
  return rowToCampus(data as unknown as CampusRow);
}

export async function removeCampus(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("campuses").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
