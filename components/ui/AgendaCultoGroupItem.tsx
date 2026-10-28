import Link from "next/link";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgendaCultoGroup } from "@/lib/agenda";

const chipClass =
  "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600";

export function AgendaCultoGroupItem({ group }: { group: AgendaCultoGroup }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="font-heading text-sm font-semibold text-slate-900">{group.title}</p>
      {group.subtitle && <p className="mt-0.5 text-sm text-slate-600">{group.subtitle}</p>}
      {group.entries.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {group.entries.map((entry, index) => {
            const label = (
              <>
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                {entry.location}
                {entry.time && <span className="font-semibold text-brand-600">· {entry.time}</span>}
              </>
            );
            const key = `${entry.location}-${entry.time}-${index}`;

            return entry.locationHref ? (
              <Link
                key={key}
                href={entry.locationHref}
                className={cn(chipClass, "transition-colors hover:border-brand-200 hover:bg-brand-50")}
              >
                {label}
              </Link>
            ) : (
              <span key={key} className={chipClass}>
                {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
