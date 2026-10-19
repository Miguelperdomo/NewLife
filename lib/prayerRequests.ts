import { createPublicClient } from "@/lib/supabase/publicClient";

/**
 * Envía un pedido de oración desde el sitio público — sin sesión, nadie
 * tiene que estar logueado para usar esto. RLS en `prayer_requests` solo
 * deja insertar (nunca leer), así que aunque cualquiera pueda llamar esto,
 * nadie puede leer los pedidos de otras personas.
 */
export async function submitPrayerRequest(input: { name?: string; message: string; contact?: string }): Promise<void> {
  const supabase = createPublicClient();
  const { error } = await supabase.from("prayer_requests").insert({
    name: input.name?.trim() || null,
    message: input.message.trim(),
    contact: input.contact?.trim() || null,
  });
  if (error) throw new Error(error.message);
}
