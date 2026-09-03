import { getPastors } from "@/lib/content";
import type { Pastor, SocialPlatform } from "@/lib/types";
import type { AdminPastor } from "@/lib/admin/types";

const PASTOR_STORAGE_KEY = "newlife-admin-pastors-v1";

function findSocialUrl(pastor: Pastor, platform: SocialPlatform) {
  return pastor.social?.find((social) => social.platform === platform)?.url;
}

/**
 * Almacén mock de Pastores — archivo propio, igual patrón que
 * lib/admin/ministries.ts (localStorage, sembrado desde los datos públicos).
 */
function seedPastorStore(): AdminPastor[] {
  const now = new Date().toISOString();
  return getPastors().map((pastor) => {
    const facebookUrl = findSocialUrl(pastor, "facebook");
    const instagramUrl = findSocialUrl(pastor, "instagram");
    const youtubeUrl = findSocialUrl(pastor, "youtube");
    const tiktokUrl = findSocialUrl(pastor, "tiktok");
    const whatsappUrl = findSocialUrl(pastor, "whatsapp");

    return {
      id: crypto.randomUUID(),
      slug: pastor.slug,
      name: pastor.name,
      role: pastor.role,
      bio: pastor.bio,
      imageSrc: pastor.imageSrc,
      tier: pastor.tier,
      status: "active",
      showPublicly: true,
      facebookUrl,
      facebookEnabled: Boolean(facebookUrl),
      instagramUrl,
      instagramEnabled: Boolean(instagramUrl),
      youtubeUrl,
      youtubeEnabled: Boolean(youtubeUrl),
      tiktokUrl,
      tiktokEnabled: Boolean(tiktokUrl),
      whatsappUrl,
      whatsappEnabled: Boolean(whatsappUrl),
      createdAt: now,
      updatedAt: now,
    };
  });
}

export function loadPastorStore(): AdminPastor[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(PASTOR_STORAGE_KEY);
  if (!raw) {
    const seeded = seedPastorStore();
    savePastorStore(seeded);
    return seeded;
  }

  try {
    return JSON.parse(raw) as AdminPastor[];
  } catch {
    const seeded = seedPastorStore();
    savePastorStore(seeded);
    return seeded;
  }
}

export function savePastorStore(pastors: AdminPastor[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PASTOR_STORAGE_KEY, JSON.stringify(pastors));
}
