import { getMinistries } from "@/lib/content";
import type { AdminMinistry } from "@/lib/admin/types";

const MINISTRY_STORAGE_KEY = "newlife-admin-ministries-v1";

/**
 * Almacén mock de Ministerios en un archivo propio (no en storage.ts):
 * este módulo no comparte nada con Eventos/Noticias/Sedes, así que separarlo
 * mantiene cada archivo enfocado en un solo módulo — mismo patrón de
 * localStorage que el resto, solo con su propia llave.
 *
 * ACTUAL:  data/ministries.ts -> lib/content.ts -> sitio público
 * ADMIN:   localStorage (este archivo) -> panel admin
 * FUTURO:  MySQL -> API -> admin + sitio público (sin mezclar antes de esa etapa)
 */
function seedMinistryStore(): AdminMinistry[] {
  const now = new Date().toISOString();
  return getMinistries().map((ministry, index) => ({
    id: crypto.randomUUID(),
    slug: ministry.slug,
    name: ministry.name,
    shortDescription: ministry.shortDescription,
    description: ministry.description,
    imageSrc: ministry.imageSrc,
    leader: ministry.leader,
    meetingSchedule: ministry.schedule,
    meetingLocation: ministry.location,
    status: "active",
    displayOrder: index + 1,
    showPublicly: true,
    createdAt: now,
    updatedAt: now,
  }));
}

export function loadMinistryStore(): AdminMinistry[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(MINISTRY_STORAGE_KEY);
  if (!raw) {
    const seeded = seedMinistryStore();
    saveMinistryStore(seeded);
    return seeded;
  }

  try {
    return JSON.parse(raw) as AdminMinistry[];
  } catch {
    const seeded = seedMinistryStore();
    saveMinistryStore(seeded);
    return seeded;
  }
}

export function saveMinistryStore(ministries: AdminMinistry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MINISTRY_STORAGE_KEY, JSON.stringify(ministries));
}
