import { createPublicClient } from "@/lib/supabase/publicClient";

// Sin sesión. RLS solo deja insertar, no leer — nadie puede ver pedidos ajenos.
export async function submitPrayerRequest(input: { name?: string; message: string; contact?: string }): Promise<void> {
  const supabase = createPublicClient();
  const { error } = await supabase.from("prayer_requests").insert({
    name: input.name?.trim() || null,
    message: input.message.trim(),
    contact: input.contact?.trim() || null,
  });
  if (error) throw new Error(error.message);
}
