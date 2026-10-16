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

/**
 * Lista los administradores — RLS solo deja ver esto a quien tiene "full".
 * El último inicio de sesión no vive en esta tabla (es de Supabase Auth), así
 * que se pide aparte a la ruta de servidor y se cruza por id; si esa segunda
 * llamada falla, igual se muestra la lista (solo sin esa columna).
 */
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

/** Cambia qué secciones puede ver un administrador y/o su fecha límite de acceso — no toca su cuenta de acceso (correo/contraseña). */
export async function updateAdminAccess(
  id: string,
  input: { sections: AdminSection[]; accessUntil: string | null }
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("admins")
    .update({ sections: input.sections, access_until: input.accessUntil })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * Crear y eliminar cuentas de verdad necesitan la llave de servicio (crean/
 * borran el usuario en Supabase Auth, no solo la fila de `admins`) — por eso
 * pasan por app/api/admin/users, una ruta de servidor, en vez de hablarle
 * directo a Supabase desde aquí.
 */
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

/** "Eliminar" solo quita la fila de `admins` (le revoca el acceso) — su cuenta de inicio de sesión no se destruye, se puede volver a agregar después. */
export async function removeAdminUser(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("admins").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
