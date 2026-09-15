import { createClient } from "@/lib/supabase/server";

export interface AdminSession {
  name: string;
}

/**
 * Sesión real contra Supabase Auth. `is_admin()` es una función SQL
 * (security definer) creada junto con la base de datos: confirma que
 * auth.uid() está presente en la tabla `admins` sin necesitar exponerla a
 * lectura directa. Devuelve null si no hay sesión O si la sesión no
 * pertenece al administrador — ambos casos se tratan igual en
 * app/admin/(dashboard)/layout.tsx (redirect a /admin/login).
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return null;

  return { name: user.email ?? "Administrador" };
}
