import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// insignia "Nuevo", misma pastilla que FeaturedBadge pero en verde
export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600",
        className
      )}
    >
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      Nuevo
    </span>
  );
}
