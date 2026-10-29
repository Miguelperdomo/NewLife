import { pastors } from "@/data/pastors";
import type { Pastor } from "@/lib/types";

// Pastores sigue siendo contenido fijo en código (data/pastors.ts), no
// Supabase. Por eso este archivo no toca nada de servidor: CampusForm
// ("use client") lo importa directo sin arrastrar el cliente de Supabase.
export function getPastors(): Pastor[] {
  return [...pastors].sort((a, b) => a.tier - b.tier);
}

export function getPastorBySlug(slug: string): Pastor | undefined {
  return pastors.find((pastor) => pastor.slug === slug);
}
