import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";

// Sin cookies ni sesión — para las lecturas públicas de lib/content.ts, que
// RLS ya protege sin necesitar saber quién está conectado. A diferencia de
// server.ts (usa cookies(), solo válido en una petición real), este también
// sirve en build time (generateStaticParams).
export function createPublicClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createSupabaseClient(url, anonKey);
}
