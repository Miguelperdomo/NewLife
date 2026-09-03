import { CampusCard } from "@/components/campuses/CampusCard";
import type { AdminCampus } from "@/lib/admin/types";
import type { Campus } from "@/lib/types";

function toPreviewCampus(campus: AdminCampus): Campus {
  return {
    slug: campus.slug || "vista-previa",
    name: campus.name || "Sin nombre",
    fullName: campus.fullName || campus.name || "Sin nombre",
    address: campus.address,
    mapQuery: campus.mapQuery,
    imageLabel: campus.name || "Sede",
    imageSrc: campus.imageSrc,
    isMain: campus.isMain,
  };
}

/**
 * Renderiza literalmente CampusCard (el mismo componente de /sedes) con los
 * datos del borrador — mismo patrón que ContentPreview.tsx.
 */
export function CampusPreview({ campus }: { campus: AdminCampus }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Así se vería aproximadamente en el sitio público — esta es la misma tarjeta que usa /sedes.
      </p>
      <div className="pointer-events-none mx-auto max-w-sm">
        <CampusCard campus={toPreviewCampus(campus)} />
      </div>
    </div>
  );
}
