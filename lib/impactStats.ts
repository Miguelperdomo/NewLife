import { createPublicClient } from "@/lib/supabase/publicClient";

export interface ImpactStats {
  prayerCount: number;
  baptismCount: number;
  visitCount: number;
}

const EMPTY_STATS: ImpactStats = { prayerCount: 0, baptismCount: 0, visitCount: 0 };

interface ImpactCountsRow {
  prayer_count: number | string;
  baptism_count: number | string;
  visit_count: number | string;
}

// Solo el número para el Home (nombres/teléfonos siguen privados). Usa la
// función de BD get_impact_counts(), que puede contar aunque RLS no deje leer directo.
export async function getImpactStats(): Promise<ImpactStats> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_impact_counts").maybeSingle();

  if (error || !data) return EMPTY_STATS;
  const row = data as ImpactCountsRow;
  return {
    prayerCount: Number(row.prayer_count) || 0,
    baptismCount: Number(row.baptism_count) || 0,
    visitCount: Number(row.visit_count) || 0,
  };
}
