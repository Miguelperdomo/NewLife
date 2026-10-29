import { createClient } from "@/lib/supabase/client";
import type { AdminSection, AdminUser } from "@/lib/admin/types";

interface AdminRow {
  id: string;
  name: string;
  email: string;
  sections: AdminSection[];
  access_until: string | null;
  created_at: string;
}

// Lista los administradores, RLS solo deja verlo a quien tiene "full". El
// último inicio de sesión no vive en esta tabla (es de Supabase Auth), se
// pide aparte y se cruza por id; si esa llamada falla, se muestra la lista
// igual, solo sin esa columna.
export async function loadAdminUsers(): Promise<AdminUser[]> {
  const supabase = createClient();
  const [{ data, error }, lastSignIns] = await Promise.all([
    supabase
      .from("admins")
      .select("id, name, email, sections, access_until, created_at")
      .order("created_at", { ascending: true }),
    loadLastSignIns(),
  ]);

  if (error || !data) return [];
  return (data as AdminRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    sections: row.sections,
    accessUntil: row.access_until,
    lastSignInAt: lastSignIns[row.id] ?? null,
    createdAt: row.created_at,
  }));
}

async function loadLastSignIns(): Promise<Record<string, string | null>> {
  try {
    const response = await fetch("/api/admin/users");
    if (!response.ok) return {};
    const result = await response.json();
    return result.lastSignIns ?? {};
  } catch {
    return {};
  }
}

/** Cambia secciones y/o fecha límite de acceso — no toca correo/contraseña. */
export async function updateAdminAccess(
  id: string,
  input: { name: string; sections: AdminSection[]; accessUntil: string | null }
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("admins")
    .update({ name: input.name, sections: input.sections, access_until: input.accessUntil })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// crear/eliminar cuentas necesita la llave de servicio (toca Supabase Auth,
// no solo la fila de admins), por eso pasa por app/api/admin/users en vez
// de hablarle directo a Supabase desde acá
export async function createAdminUser(input: {
  name: string;
  email: string;
  password: string;
  sections: AdminSection[];
  accessUntil?: string | null;
}): Promise<void> {
  const response = await fetch("/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "No se pudo crear el usuario.");
}

/** Solo quita la fila de admins (revoca acceso), la cuenta de login sigue existiendo y se puede volver a agregar. */
export async function removeAdminUser(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
