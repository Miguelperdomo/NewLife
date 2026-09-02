import { ExternalLink, MapPin, Navigation, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { googleMapsDirectionsUrl, googleMapsSearchUrl } from "@/lib/maps";
import type { Campus } from "@/lib/types";

export function CampusCard({ campus, tone = "brand" }: { campus: Campus; tone?: "brand" | "accent" | "dark" }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-100">
      <PlaceholderImage
        label={campus.imageLabel}
        src={campus.imageSrc}
        tone={tone}
        className="aspect-[4/3] w-full"
      />

      <div className="flex flex-1 flex-col p-6">
        {campus.isMain && (
          <span className="mb-2 inline-flex w-fit items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
            Sede principal
          </span>
        )}
        <h3 className="font-heading text-lg font-semibold text-slate-900">{campus.fullName}</h3>
        <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
          {campus.address}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            href={googleMapsDirectionsUrl(campus.mapQuery)}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="md"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Cómo llegar
          </Button>
          <Button
            href={googleMapsSearchUrl(`${campus.fullName} ${campus.address}`)}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            size="md"
          >
            <Star className="h-4 w-4" aria-hidden="true" />
            Ver en Google Maps
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
