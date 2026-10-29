import { CampusCard } from "@/components/campuses/CampusCard";
import type { AdminCampus } from "@/lib/admin/types";
import type { Campus } from "@/lib/types";
import { QRCodeCard } from "./QRCodeCard";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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

// usa el mismo CampusCard de /sedes, mismo patrón que ContentPreview.tsx
export function CampusPreview({ campus }: { campus: AdminCampus }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Así se vería aproximadamente en el sitio público — esta es la misma tarjeta que usa /sedes.
      </p>
      <div className="pointer-events-none mx-auto max-w-sm">
        <CampusCard campus={toPreviewCampus(campus)} />
      </div>
      {campus.slug && <QRCodeCard url={`${siteUrl}/sedes/${campus.slug}`} label={campus.name || "esta sede"} />}
    </div>
  );
}
