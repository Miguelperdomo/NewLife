import { pastors } from "@/data/pastors";
import type { Pastor } from "@/lib/types";

/**
 * Aparte de lib/content.ts a propósito: Pastores sigue siendo contenido fijo
 * en código (no Supabase — ver data/pastors.ts), así que este archivo no
 * depende de nada de servidor. Esto le permite a componentes "use client"
 * (ej. CampusForm, para elegir el pastor responsable) importar esto
 * directamente sin arrastrar el cliente de Supabase de lib/content.ts, que
 * sí usa next/headers y rompería el build si un componente de cliente lo
 * importara.
 */
export function getPastors(): Pastor[] {
  return [...pastors].sort((a, b) => a.tier - b.tier);
}

export function getPastorBySlug(slug: string): Pastor | undefined {
  return pastors.find((pastor) => pastor.slug === slug);
}
