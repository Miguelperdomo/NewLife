import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-accent-300 bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-600",
        className
      )}
    >
      <Star className="h-3 w-3 fill-current" aria-hidden="true" />
      Destacada
    </span>
  );
}
