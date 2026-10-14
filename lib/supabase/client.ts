import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Cliente de Supabase para componentes de cliente ("use client"). Usa la
 * llave pública (anon) — la única que puede llegar al navegador. Toda la
 * seguridad real la sigue imponiendo RLS en la base de datos, no esta llave.
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
