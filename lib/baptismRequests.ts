import { createPublicClient } from "@/lib/supabase/publicClient";

/**
 * Envía un "Quiero bautizarme" desde el sitio público — sin sesión. RLS en
 * `baptism_requests` solo deja insertar (nunca leer), así que aunque
 * cualquiera pueda llamar esto, nadie puede leer los pedidos de otros.
 */
export async function submitBaptismRequest(input: { name: string; phone: string }): Promise<void> {
  const supabase = createPublicClient();
  const { error } = await supabase.from("baptism_requests").insert({
    name: input.name.trim(),
    phone: input.phone.trim(),
  });
  if (error) throw new Error(error.message);
}
