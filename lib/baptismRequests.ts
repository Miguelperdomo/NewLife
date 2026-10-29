import { createPublicClient } from "@/lib/supabase/publicClient";

// Sin sesión — cualquiera puede llamar esto, pero RLS solo deja insertar,
// no leer, así que nadie ve los pedidos de otros.
export async function submitBaptismRequest(input: { name: string; phone: string }): Promise<void> {
  const supabase = createPublicClient();
  const { error } = await supabase.from("baptism_requests").insert({
    name: input.name.trim(),
    phone: input.phone.trim(),
  });
  if (error) throw new Error(error.message);
}
