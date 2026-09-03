import { MinistryTemplate } from "@/components/ministries/MinistryTemplate";
import type { AdminMinistry } from "@/lib/admin/types";
import type { Ministry } from "@/lib/types";

function toPreviewMinistry(ministry: AdminMinistry): Ministry {
  return {
    slug: ministry.slug || "vista-previa",
    name: ministry.name || "Sin nombre",
    shortDescription: ministry.shortDescription || "Sin descripción corta.",
    description: ministry.description || "Sin descripción.",
    // El formulario del admin no pide "audience" (no estaba en los campos
    // solicitados) — se usa un valor neutro solo para la vista previa.
    audience: "Todas las edades.",
    schedule: ministry.meetingSchedule || "Por definir",
    location: ministry.meetingLocation || "Por definir",
    leader: ministry.leader || "Por definir",
    imageLabel: ministry.name || "Ministerio",
    imageSrc: ministry.imageSrc,
  };
}

/**
 * Renderiza literalmente MinistryTemplate (la misma plantilla de
 * /ministerios/[slug]) con los datos del borrador — mismo patrón que
 * ContentPreview.tsx/CampusPreview.tsx: nunca una segunda plantilla visual.
 */
export function MinistryPreview({ ministry }: { ministry: AdminMinistry }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Así se vería aproximadamente en el sitio público — esta es la misma plantilla que usa
        /ministerios/[slug].
      </p>
      {!ministry.showPublicly && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800">
          Este ministerio está marcado como oculto — no aparecerá en /ministerios hasta que se muestre
          públicamente.
        </p>
      )}
      <div className="pointer-events-none overflow-hidden rounded-2xl border border-slate-100">
        <MinistryTemplate ministry={toPreviewMinistry(ministry)} />
      </div>
    </div>
  );
}
