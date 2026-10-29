import { createClient } from "@/lib/supabase/client";
import type { AdminActivityLogEntry } from "@/lib/admin/types";

// Registra la acción en admin_activity_log para que un admin con "Todo"
// pueda ver qué hicieron los que tienen permisos limitados. Se llama al
// final de cada función que guarda algo en lib/admin/*.ts.
// Si falla (sin conexión, etc) no tumba la acción real — mejor perder el
// registro que hacerle creer al admin que su cambio no se guardó.
export async function logActivity(summary: string, details?: Record<string, string | undefined>): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: row } = await supabase.from("admins").select("name").eq("id", user.id).maybeSingle();
    const adminName = (row as { name: string | null } | null)?.name || user.email || "Administrador";

    // quitamos los vacíos, si no el informe queda lleno de "—"
    const cleanDetails = details
      ? Object.fromEntries(
          Object.entries(details).filter(([, value]) => value !== undefined && value !== null && value !== "")
        )
      : undefined;

    await supabase.from("admin_activity_log").insert({
      admin_id: user.id,
      admin_name: adminName,
      summary,
      details: cleanDetails && Object.keys(cleanDetails).length > 0 ? cleanDetails : null,
    });
  } catch {
    // silencioso a propósito, ver arriba
  }
}

interface ActivityLogRow {
  id: number;
  admin_name: string;
  summary: string;
  created_at: string;
  details: Record<string, string> | null;
}

const MAX_ENTRIES = 50;

export async function loadActivityLog(): Promise<AdminActivityLogEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("admin_activity_log")
    .select("id, admin_name, summary, created_at, details")
    .order("created_at", { ascending: false })
    .limit(MAX_ENTRIES);

  if (error || !data) return [];
  return (data as ActivityLogRow[]).map((row) => ({
    id: row.id,
    adminName: row.admin_name,
    summary: row.summary,
    createdAt: row.created_at,
    details: row.details ?? undefined,
  }));
}

/** Solo puede borrar quien tiene "Todo" (lo filtra RLS). */
export async function removeActivityLogEntries(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createClient();
  const { error } = await supabase.from("admin_activity_log").delete().in("id", ids);
  if (error) throw new Error(error.message);
}

const EXPORT_MAX_ENTRIES = 2000;

// Para exportar: sin el límite de 50 de la vista en pantalla (hasta 2000),
// y los filtros van en la consulta, no en el navegador.
export async function loadActivityLogForExport(filters: {
  from?: string;
  to?: string;
  adminName?: string;
}): Promise<AdminActivityLogEntry[]> {
  const supabase = createClient();
  let query = supabase
    .from("admin_activity_log")
    .select("id, admin_name, summary, created_at, details")
    .order("created_at", { ascending: false })
    .limit(EXPORT_MAX_ENTRIES);

  if (filters.from) query = query.gte("created_at", `${filters.from}T00:00:00`);
  if (filters.to) query = query.lte("created_at", `${filters.to}T23:59:59`);
  if (filters.adminName) query = query.ilike("admin_name", `%${filters.adminName}%`);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as ActivityLogRow[]).map((row) => ({
    id: row.id,
    adminName: row.admin_name,
    summary: row.summary,
    createdAt: row.created_at,
    details: row.details ?? undefined,
  }));
}
