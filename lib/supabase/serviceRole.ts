import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con la llave de servicio de Supabase — se salta RLS por completo y
 * puede crear/borrar cuentas de verdad (auth.admin.*). Por eso:
 * - `import "server-only"` hace que el build truene si algo intenta meter
 *   este archivo en el paquete del navegador, aunque sea sin querer.
 * - Solo se usa desde Route Handlers (app/api/admin/...), nunca desde un
 *   Server Component ni un Client Component.
 * - La llave vive en `SUPABASE_SERVICE_ROLE_KEY` (sin prefijo NEXT_PUBLIC_,
 *   así que Next.js nunca la incluye en el código que llega al navegador).
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY (o la URL) en las variables de entorno del servidor.");
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
