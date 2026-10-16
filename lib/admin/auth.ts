import { createClient } from "@/lib/supabase/server";
import type { AdminSection } from "@/lib/admin/types";

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  sections: AdminSection[];
}

interface AdminRow {
  name: string | null;
  sections: AdminSection[] | null;
  access_until: string | null;
}

/**
 * Sesión real contra Supabase Auth. `is_admin()` es una función SQL
 * (security definer) creada junto con la base de datos: confirma que
 * auth.uid() está presente en la tabla `admins` sin necesitar exponerla a
 * lectura directa. Devuelve null si no hay sesión O si la sesión no
 * pertenece al administrador — ambos casos se tratan igual en
 * app/admin/(dashboard)/layout.tsx (redirect a /admin/login).
 *
 * `sections` es lo que decide qué partes del panel puede ver/tocar esta
 * cuenta — "full" es el comodín que da acceso a todo. Una fila propia en
 * `admins` siempre es legible por su dueño (política "select_own_admin_row"),
 * por eso este select funciona aunque la tabla esté cerrada para todo lo demás.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return null;

  const { data: row } = await supabase
    .from("admins")
    .select("name, sections, access_until")
    .eq("id", user.id)
    .maybeSingle();
  const adminRow = row as AdminRow | null;

  // Si `access_until` ya pasó, la sesión se trata como "Sin permisos" sin
  // borrar lo que esa persona tenía guardado en `sections` — así, si luego le
  // extienden la fecha, recupera exactamente los mismos permisos de antes en
  // vez de que un administrador tenga que volver a marcar todo desde cero.
  const today = new Date().toISOString().slice(0, 10);
  const expired = !!adminRow?.access_until && adminRow.access_until < today;

  return {
    id: user.id,
    name: adminRow?.name || user.email || "Administrador",
    email: user.email ?? "",
    // OJO: `?? ["full"]` (no `.length > 0 ? ... : ["full"]`) a propósito — ese
    // operador solo cae al respaldo cuando `sections` es null/undefined
    // (fila vieja de antes de que existiera este sistema de roles), nunca
    // cuando es un arreglo vacío `[]`. Antes, cualquiera marcado como "Sin
    // permisos" (sections = []) terminaba tratado como "Todo" por error — la
    // misma regla pensada para cuentas viejas atrapaba también a quien se
    // quería dejar a propósito sin ningún acceso.
    sections: expired ? [] : adminRow?.sections ?? ["full"],
  };
}

export function hasSection(session: AdminSession, section: AdminSection): boolean {
  return session.sections.includes("full") || session.sections.includes(section);
}
