import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";
import { LogoMark } from "./LogoMark";

export function Logo({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading font-bold",
        variant === "light" ? "text-white" : "text-brand-700",
        className
      )}
    >
      <LogoMark className="h-9 w-9 rounded-full" />
      {siteConfig.name}
    </span>
  );
}
