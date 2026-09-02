import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { MinistryIcon } from "@/components/ministries/ministryIcons";
import { EventBadge } from "./EventBadge";
import { getCampusBySlug, getMinistryBySlug } from "@/lib/content";
import { formatEventDate, getEventStatus } from "@/lib/events";
import type { ChurchEvent } from "@/lib/types";

const tones = ["brand", "accent", "dark"] as const;

export function EventCard({ event, index = 0 }: { event: ChurchEvent; index?: number }) {
  const tone = tones[index % tones.length];
  const status = getEventStatus(event.date, event.endDate);
  const campus = event.campus ? getCampusBySlug(event.campus) : undefined;
  const ministryLabel = (event.ministry && getMinistryBySlug(event.ministry)?.name) ?? "General";

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-100 transition-transform hover:-translate-y-1"
    >
      <div className="relative">
        <PlaceholderImage
          label={event.imageLabel}
          src={event.imageSrc}
          tone={tone}
          className="aspect-[4/3] w-full"
        />
        <EventBadge status={status} className="absolute left-3 top-3 bg-white/90 backdrop-blur" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {formatEventDate(event.date, event.endDate)}
          {event.time ? ` · ${event.time}` : ""}
        </span>
        <h3 className="mt-2 font-heading text-lg font-semibold text-slate-900">{event.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {event.shortDescription}
        </p>

        <div className="mt-4 space-y-1.5 text-sm text-slate-500">
          {campus && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              {campus.name}
            </div>
          )}
          <div className="flex items-center gap-2">
            <MinistryIcon slug={event.ministry ?? "general"} className="h-4 w-4 shrink-0 text-brand-600" />
            {ministryLabel}
          </div>
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
          Ver evento
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
