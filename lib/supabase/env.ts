/**
 * Lee las variables de entorno de Supabase con un mensaje claro si faltan —
 * en vez de dejar que `createClient(...)` truene con un TypeError críptico
 * ("Cannot read properties of undefined") cuando a un despliegue le falta
 * configurarlas.
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Revisa la configuración del despliegue."
    );
  }

  return { url, anonKey };
}
