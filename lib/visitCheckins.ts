import { createPublicClient } from "@/lib/supabase/publicClient";

/** próximo domingo (hoy si ya es domingo), default del formulario */
export function nextSundayISO(): string {
  const today = new Date();
  const daysUntilSunday = (7 - today.getDay()) % 7;
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSunday);
  return sunday.toISOString().slice(0, 10);
}

// "Avísanos que vienes", sin sesión. RLS solo deja insertar, no leer.
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
