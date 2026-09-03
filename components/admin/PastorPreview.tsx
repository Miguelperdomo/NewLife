import { PastorTemplate } from "@/components/pastors/PastorTemplate";
import type { AdminPastor } from "@/lib/admin/types";
import type { Pastor, SocialLink, SocialPlatform } from "@/lib/types";

function buildSocial(pastor: AdminPastor): SocialLink[] {
  const entries: { platform: SocialPlatform; label: string; url?: string; enabled: boolean }[] = [
    { platform: "facebook", label: "Facebook", url: pastor.facebookUrl, enabled: pastor.facebookEnabled },
    { platform: "instagram", label: "Instagram", url: pastor.instagramUrl, enabled: pastor.instagramEnabled },
    { platform: "youtube", label: "YouTube", url: pastor.youtubeUrl, enabled: pastor.youtubeEnabled },
    { platform: "tiktok", label: "TikTok", url: pastor.tiktokUrl, enabled: pastor.tiktokEnabled },
    { platform: "whatsapp", label: "WhatsApp", url: pastor.whatsappUrl, enabled: pastor.whatsappEnabled },
  ];

  return entries
    .filter((entry) => entry.enabled && entry.url)
    .map((entry) => ({ platform: entry.platform, label: entry.label, url: entry.url as string }));
}

function toPreviewPastor(pastor: AdminPastor): Pastor {
  return {
    slug: pastor.slug || "vista-previa",
    name: pastor.name || "Sin nombre",
    role: pastor.role || "Sin cargo",
    bio: pastor.bio || "Sin biografía.",
    imageLabel: pastor.name || "Pastor",
    imageSrc: pastor.imageSrc,
    tier: pastor.tier || 1,
    social: buildSocial(pastor),
  };
}

/**
 * Renderiza literalmente PastorTemplate (la misma plantilla de
 * /pastores/[slug]) con los datos del borrador — mismo patrón que
 * MinistryPreview.tsx/CampusPreview.tsx: nunca una segunda plantilla visual.
 */
export function PastorPreview({ pastor }: { pastor: AdminPastor }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Así se vería aproximadamente en el sitio público — esta es la misma plantilla que usa
        /pastores/[slug].
      </p>
      {!pastor.showPublicly && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800">
          Este pastor está marcado como oculto — no aparecerá en /pastores hasta que se muestre
          públicamente.
        </p>
      )}
      <div className="pointer-events-none overflow-hidden rounded-2xl border border-slate-100">
        <PastorTemplate pastor={toPreviewPastor(pastor)} />
      </div>
    </div>
  );
}
