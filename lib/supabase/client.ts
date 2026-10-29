import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

// Cliente de Supabase para componentes "use client". Usa la llave anon, la
// única que puede llegar al navegador — la seguridad real la pone RLS, no esta llave.
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
