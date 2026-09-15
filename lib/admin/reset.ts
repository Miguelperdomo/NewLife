/**
 * Llaves de localStorage que todavía usan los módulos del admin sin migrar
 * (ver storage.ts). Configuración, Sedes y Ministerios ya no aparecen aquí:
 * viven en Supabase (`site_settings`, `campuses`, `ministries`) — ver
 * lib/admin/siteSettings.ts, lib/admin/campuses.ts y lib/admin/ministries.ts.
 * Pastores tampoco: ya no tiene módulo admin, es contenido fijo en
 * data/pastors.ts.
 */
const ADMIN_STORAGE_KEYS = ["newlife-admin-content-v1"];

/** Borra todo el contenido mock del admin. Cada módulo se vuelve a sembrar solo desde sus datos públicos la próxima vez que se cargue. */
export function clearAllAdminData() {
  if (typeof window === "undefined") return;
  ADMIN_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
}
