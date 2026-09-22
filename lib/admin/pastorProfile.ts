import { createClient } from "@/lib/supabase/client";
import type { AdminPastorProfile } from "@/lib/admin/types";

/**
 * Perfil del pastor principal (tabla `pastor`, singleton fila id=1) — mismo
 * patrón que lib/admin/siteSettings.ts.
 */
const ROW_ID = 1;

interface PastorRow {
  name: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  whatsapp_number: string | null;
  facebook_url: string | null;
  facebook_enabled: boolean;
  instagram_url: string | null;
  instagram_enabled: boolean;
  updated_at: string;
}

function rowToPastor(row: PastorRow): AdminPastorProfile {
  return {
    name: row.name,
    role: row.role ?? undefined,
    bio: row.bio ?? undefined,
    imageSrc: row.image_url ?? undefined,
    whatsappNumber: row.whatsapp_number ?? undefined,
    facebookUrl: row.facebook_url ?? undefined,
    facebookEnabled: row.facebook_enabled,
    instagramUrl: row.instagram_url ?? undefined,
    instagramEnabled: row.instagram_enabled,
    updatedAt: row.updated_at,
  };
}

/** Valores de arranque cuando todavía no existe la fila en Supabase. */
function defaultPastorProfile(): AdminPastorProfile {
  return {
    name: "Apóstol Giovany",
    role: "Apóstol · Fundador y Pastor Principal",
    bio: undefined,
    imageSrc: undefined,
    whatsappNumber: undefined,
    facebookUrl: undefined,
    facebookEnabled: false,
    instagramUrl: undefined,
    instagramEnabled: false,
    updatedAt: new Date().toISOString(),
  };
}

export async function loadPastorProfile(): Promise<AdminPastorProfile> {
  const supabase = createClient();
  const { data, error } = await supabase.from("pastor").select("*").eq("id", ROW_ID).maybeSingle();

  if (error || !data) return defaultPastorProfile();
  return rowToPastor(data as PastorRow);
}

export async function savePastorProfile(profile: AdminPastorProfile): Promise<AdminPastorProfile> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pastor")
    .upsert(
      {
        id: ROW_ID,
        name: profile.name,
        role: profile.role ?? null,
        bio: profile.bio ?? null,
        image_url: profile.imageSrc ?? null,
        whatsapp_number: profile.whatsappNumber ?? null,
        facebook_url: profile.facebookUrl ?? null,
        facebook_enabled: profile.facebookEnabled,
        instagram_url: profile.instagramUrl ?? null,
        instagram_enabled: profile.instagramEnabled,
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "No se pudo guardar el perfil del pastor.");
  return rowToPastor(data as PastorRow);
}
