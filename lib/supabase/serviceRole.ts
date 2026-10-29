import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente con la llave de servicio — se salta RLS por completo y puede
// crear/borrar cuentas de verdad (auth.admin.*). CUIDADO con esto:
// - "server-only" hace tronar el build si esto se cuela al bundle del navegador.
// - Solo se usa desde Route Handlers (app/api/admin/...).
// - La llave no tiene prefijo NEXT_PUBLIC_, así que nunca llega al navegador.
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
