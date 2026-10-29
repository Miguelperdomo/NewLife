// Si faltan las env vars, mejor este error claro que el TypeError críptico
// que tira createClient(...) cuando le llega undefined.
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
