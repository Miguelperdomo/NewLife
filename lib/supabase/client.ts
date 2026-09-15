import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para componentes de cliente ("use client"). Usa la
 * llave pública (anon) — la única que puede llegar al navegador. Toda la
 * seguridad real la sigue imponiendo RLS en la base de datos, no esta llave.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
