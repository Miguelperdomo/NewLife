export interface AdminSession {
  name: string;
}

/**
 * Placeholder de autenticación. Hoy devuelve siempre una sesión mock para
 * que el panel sea usable sin login real (todavía no existe en el proyecto).
 *
 * Cuando se implemente autenticación de verdad (NextAuth, Clerk, sesión
 * propia...), esta función debe:
 *   1. Leer la sesión real (cookie/JWT/etc.).
 *   2. Devolver `null` si no hay usuario autenticado.
 *   3. `app/admin/layout.tsx` debe entonces hacer `redirect("/login")`.
 * Ningún otro archivo del módulo admin necesita cambiar.
 */
export function getAdminSession(): AdminSession | null {
  return { name: "Administrador" };
}
