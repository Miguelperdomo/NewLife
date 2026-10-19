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

/**
 * Totales de Oración/Bautismo/Primera visita para mostrar en el Home — solo
 * el número, nunca las filas (nombres, mensajes, teléfonos siguen privados).
 * Usa get_impact_counts(), una función de base de datos que sí puede contar
 * esas tablas aunque su RLS no deje leerlas directo desde el sitio público.
 */
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
