import { cn } from "@/lib/utils";

export interface NewsFilterOption {
  label: string;
  value: string;
}

/** Mismo patrón visual que EventFilters — pastillas de categoría. */
export function NewsFilters({
  options,
  active,
  onChange,
}: {
  options: NewsFilterOption[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
      {options.map((option) => {
        const isActive = option.value === active;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
