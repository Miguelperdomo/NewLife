import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import type { Ministry } from "@/lib/types";
import { MinistryIcon } from "./ministryIcons";

const tones = ["brand", "accent", "dark"] as const;

export function MinistryCard({ ministry, index = 0 }: { ministry: Ministry; index?: number }) {
  const tone = tones[index % tones.length];
  const hasHoverInfo = Boolean(ministry.schedule || ministry.leader);

  return (
    <RevealOnScroll index={index}>
      <Link
        href={`/ministerios/${ministry.slug}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-100 transition-all hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/80"
      >
        <div className="relative">
          <PlaceholderImage
            label={ministry.imageLabel}
            src={ministry.imageSrc}
            tone={tone}
            className="aspect-[4/3] w-full"
          />
          {hasHoverInfo && (
            <div className="absolute inset-0 flex flex-col justify-end gap-1.5 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {ministry.schedule && (
                <p className="flex items-center gap-1.5 text-xs font-semibold">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {ministry.schedule}
                </p>
              )}
              {ministry.leader && (
                <p className="flex items-center gap-1.5 text-xs font-semibold">
                  <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {ministry.leader}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <MinistryIcon slug={ministry.slug} className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-slate-900">
            {ministry.name}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            {ministry.shortDescription}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
            Conocer
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </RevealOnScroll>
  );
}
