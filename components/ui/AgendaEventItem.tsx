import Link from "next/link";
import { MapPin } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { agendaTypeMeta } from "@/components/ui/Calendar";
import { cn } from "@/lib/utils";
import type { AgendaItem } from "@/lib/agenda";

const cardClass = "rounded-2xl border border-slate-100 bg-slate-50 p-4";

export function AgendaEventItem({ item }: { item: AgendaItem }) {
  const content = (
    <div className="flex gap-3">
      {item.type === "noticia" && (
        <PlaceholderImage
          label={item.imageLabel ?? item.title}
          src={item.imageSrc}
          tone="accent"
          className="h-16 w-16 shrink-0 rounded-xl"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {item.time && (
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {item.time}
            </span>
          )}
          <span
            className={cn("h-1.5 w-1.5 rounded-full", agendaTypeMeta[item.type].dotClass)}
            aria-hidden="true"
          />
        </div>
        <p className="mt-1 font-heading text-sm font-semibold text-slate-900">{item.title}</p>
        {item.subtitle && <p className="mt-0.5 text-sm text-slate-600">{item.subtitle}</p>}
        {item.ministryLabel && (
          <p className="mt-1 text-xs font-medium text-emerald-700">{item.ministryLabel}</p>
        )}
        {item.location && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {item.location}
          </p>
        )}
        {item.isMultiDay && item.dateRangeLabel && (
          <p className="mt-1 text-xs font-medium text-brand-600">{item.dateRangeLabel}</p>
        )}
      </div>
    </div>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={cn(
          cardClass,
          "block transition-colors hover:border-brand-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        )}
      >
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
