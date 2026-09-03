/**
 * Todas las llaves de localStorage que usa el mock del admin — una por
 * módulo (ver storage.ts, ministries.ts, pastors.ts, siteSettings.ts).
 * Central aquí solo para la acción "Limpiar datos locales" de Configuración;
 * cada módulo sigue siendo dueño de su propia llave y su propia lógica de
 * sembrado.
 */
const ADMIN_STORAGE_KEYS = [
  "newlife-admin-content-v1",
  "newlife-admin-campuses-v1",
  "newlife-admin-ministries-v1",
  "newlife-admin-pastors-v1",
  "newlife-admin-site-settings-v1",
];

/** Borra todo el contenido mock del admin. Cada módulo se vuelve a sembrar solo desde sus datos públicos la próxima vez que se cargue. */
export function clearAllAdminData() {
  if (typeof window === "undefined") return;
  ADMIN_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
}
