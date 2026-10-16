import { createClient } from "@/lib/supabase/client";
import type { AdminActivityLogEntry } from "@/lib/admin/types";

/**
 * Deja constancia de una acción (crear/editar/archivar/eliminar...) en
 * `admin_activity_log` — pensado sobre todo para cuando un administrador con
 * permisos limitados (ej. solo Ministerios) hace un cambio: quien tiene
 * "Todo" puede ver qué se hizo, sin tener que confiar a ciegas. Se llama al
 * final de cada función que guarda algo en lib/admin/*.ts.
 *
 * `details` es opcional a propósito — no todas las acciones tienen campos
 * que valga la pena detallar (ej. archivar no cambia ningún dato, solo el
 * estado, que ya va en el resumen). Cuando se pasa, cada entrada se muestra
 * en el informe completo al hacer clic sobre el registro.
 *
 * Silencioso a propósito: si falla (ej. sin conexión), NO debe tumbar la
 * acción real que el administrador sí alcanzó a hacer — perder el registro
 * es mejor que fingir que la acción en sí también falló.
 */
export async function logActivity(summary: string, details?: Record<string, string | undefined>): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: row } = await supabase.from("admins").select("name").eq("id", user.id).maybeSingle();
    const adminName = (row as { name: string | null } | null)?.name || user.email || "Administrador";

    // Se descartan los campos vacíos/sin valor — un informe con "Resumen: —"
    // en cada fila no le dice nada a quien lo está leyendo.
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
    // Silencioso — ver comentario de arriba.
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

/** Borra uno o varios registros de Actividad — solo puede hacerlo quien tiene "Todo" (RLS). */
export async function removeActivityLogEntries(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createClient();
  const { error } = await supabase.from("admin_activity_log").delete().in("id", ids);
  if (error) throw new Error(error.message);
}

const EXPORT_MAX_ENTRIES = 2000;

/**
 * Igual que loadActivityLog(), pero para exportar: sin el límite de 50 de la
 * vista en pantalla (hasta 2000, de sobra para el historial de una iglesia) y
 * con filtros de fecha/administrador aplicados en la consulta misma, no en
 * el navegador.
 */
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
