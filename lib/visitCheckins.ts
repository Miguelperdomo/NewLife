import { createPublicClient } from "@/lib/supabase/publicClient";

/** El próximo domingo (hoy mismo si hoy ya es domingo) — valor por defecto del formulario. */
export function nextSundayISO(): string {
  const today = new Date();
  const daysUntilSunday = (7 - today.getDay()) % 7;
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSunday);
  return sunday.toISOString().slice(0, 10);
}

/**
 * Envía un "Avísanos que vienes" desde el sitio público — sin sesión. RLS en
 * `visit_checkins` solo deja insertar (nunca leer).
 */
export async function submitVisitCheckin(input: {
  name: string;
  phone: string;
  peopleCount: number;
  campus: string;
  visitDate: string;
  isPastor: boolean;
}): Promise<void> {
  const supabase = createPublicClient();
  const { error } = await supabase.from("visit_checkins").insert({
    name: input.name.trim(),
    phone: input.phone.trim(),
    people_count: input.peopleCount,
    campus: input.campus,
    visit_date: input.visitDate,
    is_pastor: input.isPastor,
  });
  if (error) throw new Error(error.message);
}
