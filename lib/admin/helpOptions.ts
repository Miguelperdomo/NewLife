import { createClient } from "@/lib/supabase/client";
import type { AdminHelpOption } from "@/lib/admin/types";

/**
 * Opciones del widget de Ayuda y donaciones (tabla `help_options`) — lista
 * libre sin id propio del lado del formulario, se reemplaza completa al
 * guardar (mismo patrón que lib/admin/firstTimeCards.ts).
 */
interface OptionRow {
  icon: string;
  title: string;
  description: string;
  display_order: number;
}

export async function loadHelpOptions(): Promise<AdminHelpOption[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("help_options")
    .select("icon, title, description, display_order")
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return (data as OptionRow[]).map((row) => ({
    icon: row.icon,
    title: row.title,
    description: row.description,
  }));
}

export async function saveHelpOptions(options: AdminHelpOption[]): Promise<void> {
  const supabase = createClient();
  await supabase.from("help_options").delete().not("id", "is", null);

  if (options.length > 0) {
    await supabase.from("help_options").insert(
      options.map((option, index) => ({
        icon: option.icon,
        title: option.title,
        description: option.description,
        display_order: index,
      }))
    );
  }
}
