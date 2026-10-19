import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/admin/activityLog";
import type { AdminVisitCheckin } from "@/lib/admin/types";

interface VisitCheckinRow {
  id: number;
  name: string;
  people_count: number;
  campus: string;
  visit_date: string;
  status: "nueva" | "atendida";
  created_at: string;
}

/** RLS solo deja ver esto a quien tenga el permiso "visits" (o "full"). */
export async function loadVisitCheckins(): Promise<AdminVisitCheckin[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("visit_checkins")
    .select("id, name, people_count, campus, visit_date, status, created_at")
    .order("visit_date", { ascending: true });

  if (error || !data) return [];
  return (data as VisitCheckinRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    peopleCount: row.people_count,
    campus: row.campus,
    visitDate: row.visit_date,
    status: row.status,
    createdAt: row.created_at,
  }));
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
