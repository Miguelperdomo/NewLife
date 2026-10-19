import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/admin/activityLog";
import type { AdminBaptismRequest } from "@/lib/admin/types";

interface BaptismRequestRow {
  id: number;
  name: string;
  phone: string;
  status: "nueva" | "atendida";
  created_at: string;
}

/** RLS solo deja ver esto a quien tenga el permiso "baptism" (o "full"). */
export async function loadBaptismRequests(): Promise<AdminBaptismRequest[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("baptism_requests")
    .select("id, name, phone, status, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as BaptismRequestRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function setBaptismRequestStatus(id: number, status: "nueva" | "atendida"): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("baptism_requests").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity(status === "atendida" ? "marcó un 'Quiero bautizarme' como atendido" : "marcó un 'Quiero bautizarme' como nuevo otra vez");
}

/** Borra uno o varios pedidos de bautismo ya atendidos. */
export async function removeBaptismRequests(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createClient();
  const { error } = await supabase.from("baptism_requests").delete().in("id", ids);
  if (error) throw new Error(error.message);
  await logActivity(`eliminó ${ids.length} pedido${ids.length === 1 ? "" : "s"} de bautismo`);
}
