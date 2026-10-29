import { createClient } from "@/lib/supabase/client";
import type { AdminFirstTimeCard } from "@/lib/admin/types";

// Tarjetas de "¿Es tu primera vez?" (tabla first_time_cards) — lista libre,
// se reemplaza completa al guardar (igual que syncCampusSchedules).
interface CardRow {
  icon: string;
  title: string;
  description: string;
  display_order: number;
}

export async function loadFirstTimeCards(): Promise<AdminFirstTimeCard[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("first_time_cards")
    .select("icon, title, description, display_order")
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return (data as CardRow[]).map((row) => ({
    icon: row.icon,
    title: row.title,
    description: row.description,
  }));
}

export async function saveFirstTimeCards(cards: AdminFirstTimeCard[]): Promise<void> {
  const supabase = createClient();
  // delete() sin filtro no funciona, .not("id","is",null) calza con todas las filas reales
  await supabase.from("first_time_cards").delete().not("id", "is", null);

  if (cards.length > 0) {
    await supabase.from("first_time_cards").insert(
      cards.map((card, index) => ({
        icon: card.icon,
        title: card.title,
        description: card.description,
        display_order: index,
      }))
    );
  }
}
