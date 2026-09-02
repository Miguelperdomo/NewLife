import { Crown } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { cn } from "@/lib/utils";
import type { Pastor } from "@/lib/types";

export function PastorCard({
  pastor,
  variant = "member",
}: {
  pastor: Pastor;
  variant?: "lead" | "member";
}) {
  const isLead = variant === "lead";

  return (
    <div className="flex w-56 flex-col items-center text-center">
      <div className="relative">
        {isLead && (
          <div
            className="absolute -inset-3 rounded-full bg-gradient-to-br from-brand-500 via-accent-500 to-brand-500 opacity-70 blur-lg"
            aria-hidden="true"
          />
        )}
        <div
          className={cn(
            "relative overflow-hidden rounded-full border-4 border-white/10 shadow-xl shadow-black/40",
            isLead ? "h-40 w-40 sm:h-48 sm:w-48" : "h-28 w-28 sm:h-32 sm:w-32"
          )}
        >
          <PlaceholderImage
            label={pastor.imageLabel}
            src={pastor.imageSrc}
            tone="dark"
            className="h-full w-full"
          />
        </div>
        {isLead && (
          <span className="absolute -bottom-2 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-accent-500 text-brand-950 shadow-lg">
            <Crown className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </div>

      <h3
        className={cn(
          "font-heading font-bold text-white",
          isLead ? "mt-6 text-2xl sm:text-3xl" : "mt-4 text-lg"
        )}
      >
        {pastor.name}
      </h3>
      <p
        className={cn(
          "mt-1 font-semibold uppercase tracking-wide text-accent-400",
          isLead ? "text-sm" : "text-xs"
        )}
      >
        {pastor.role}
      </p>

      {isLead && pastor.bio && (
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{pastor.bio}</p>
      )}
    </div>
  );
}
