import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase sin cookies ni sesión — para las lecturas públicas de
 * lib/content.ts (Ministerios, Sedes...), que RLS ya protege sin necesitar
 * saber quién está conectado. A diferencia de lib/supabase/server.ts (usa
 * next/headers -> cookies(), solo válido durante una petición real), este
 * es seguro de usar también en tiempo de build (generateStaticParams, que
 * corre sin ninguna petición HTTP de por medio).
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
