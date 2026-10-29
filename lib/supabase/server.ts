import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/supabase/env";

// Cliente para Server Components/Actions, lee/escribe sesión vía cookies.
// El try/catch al escribir es porque un Server Component no puede tocar
// cookies (solo Server Actions/Route Handlers) — ahí el middleware se encarga.
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
            // viene de un Server Component, el middleware ya sincroniza la sesión
          }
        },
      },
    }
  );
}
