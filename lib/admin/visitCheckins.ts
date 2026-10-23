import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/admin/activityLog";
import type { AdminVisitCheckin } from "@/lib/admin/types";

interface VisitCheckinRow {
  id: number;
  name: string;
  phone: string | null;
  people_count: number;
  campus: string;
  visit_date: string;
  is_pastor: boolean;
  status: "nueva" | "atendida";
  created_at: string;
}

/**
 * RLS solo deja ver esto a quien tenga el permiso "visits" (o "full"). Las
 * visitas de pastores van primero (se gestionan aparte, igual que lo pedido),
 * y dentro de cada grupo se mantiene el orden por fecha de visita de siempre.
 */
export async function loadVisitCheckins(): Promise<AdminVisitCheckin[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("visit_checkins")
    .select("id, name, phone, people_count, campus, visit_date, is_pastor, status, created_at")
    .order("visit_date", { ascending: true });

  if (error || !data) return [];
  return (data as VisitCheckinRow[])
    .map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone ?? undefined,
      peopleCount: row.people_count,
      campus: row.campus,
      visitDate: row.visit_date,
      isPastor: row.is_pastor,
      status: row.status,
      createdAt: row.created_at,
    }))
    .sort((a, b) => Number(b.isPastor) - Number(a.isPastor));
}

export async function setVisitCheckinStatus(id: number, status: "nueva" | "atendida"): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("visit_checkins").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity(status === "atendida" ? "marcó un aviso de primera visita como atendido" : "marcó un aviso de primera visita como nuevo otra vez");
}

/** Borra uno o varios avisos de primera visita ya pasados. */
export async function removeVisitCheckins(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createClient();
  const { error } = await supabase.from("visit_checkins").delete().in("id", ids);
  if (error) throw new Error(error.message);
  await logActivity(`eliminó ${ids.length} aviso${ids.length === 1 ? "" : "s"} de primera visita`);
}
