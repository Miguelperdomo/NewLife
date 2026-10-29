import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/admin/activityLog";
import type { AdminPrayerRequest } from "@/lib/admin/types";

interface PrayerRequestRow {
  id: number;
  name: string | null;
  message: string;
  contact: string | null;
  status: "nueva" | "atendida";
  created_at: string;
}

/** Solo lo ve quien tenga el permiso "prayer" (o "full"), por RLS. */
export async function loadPrayerRequests(): Promise<AdminPrayerRequest[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prayer_requests")
    .select("id, name, message, contact, status, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as PrayerRequestRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    message: row.message,
    contact: row.contact,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function setPrayerRequestStatus(id: number, status: "nueva" | "atendida"): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("prayer_requests").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity(status === "atendida" ? "marcó un pedido de oración como atendido" : "marcó un pedido de oración como nuevo otra vez");
}

/** Borra pedidos de oración ya atendidos. */
export async function removePrayerRequests(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  const supabase = createClient();
  const { error } = await supabase.from("prayer_requests").delete().in("id", ids);
  if (error) throw new Error(error.message);
  await logActivity(`eliminó ${ids.length} pedido${ids.length === 1 ? "" : "s"} de oración`);
}
