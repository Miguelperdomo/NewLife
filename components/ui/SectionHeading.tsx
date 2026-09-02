import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  /** "dark" para usar sobre fondos oscuros (Hero, LiveSection, Pastores...). */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "text-sm font-semibold uppercase tracking-widest",
            tone === "dark" ? "text-accent-400" : "text-brand-600"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl",
          tone === "dark" ? "text-white" : "text-slate-900"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-lg", tone === "dark" ? "text-white/70" : "text-slate-600")}>
          {description}
        </p>
      )}
    </div>
  );
}
