import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import type { Ministry } from "@/lib/types";
import { MinistryIcon } from "./ministryIcons";

const tones = ["brand", "accent", "dark"] as const;

export function MinistryCard({ ministry, index = 0 }: { ministry: Ministry; index?: number }) {
  const tone = tones[index % tones.length];

  return (
    <Link
      href={`/ministerios/${ministry.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-100 transition-transform hover:-translate-y-1"
    >
      <PlaceholderImage
        label={ministry.imageLabel}
        src={ministry.imageSrc}
        tone={tone}
        className="aspect-[4/3] w-full"
      />

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
  );
}
