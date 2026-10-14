import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Cliente de Supabase para Server Components/Actions. Lee y escribe la
 * sesión a través de las cookies de la petición actual. El `try/catch` al
 * escribir existe porque un Server Component no puede modificar cookies
 * (solo Server Actions/Route Handlers pueden) — en ese caso el middleware
 * (ver middleware.ts) es quien se encarga de refrescar la sesión.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se ignora si se llama desde un Server Component — el middleware
            // ya se encarga de mantener la sesión sincronizada en ese caso.
          }
        },
      },
    }
  );
}
