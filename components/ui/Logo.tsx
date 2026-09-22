import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";
import { LogoMark } from "./LogoMark";

export function Logo({
  variant = "dark",
  className,
  logoSrc,
  name,
}: {
  variant?: "dark" | "light";
  className?: string;
  /** Logo/nombre guardados en Configuración; si no se pasan, usa los fijos de siempre. */
  logoSrc?: string;
  name?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading font-bold",
        variant === "light" ? "text-white" : "text-brand-700",
        className
      )}
    >
      <LogoMark className="h-9 w-9 rounded-full" src={logoSrc} alt={`Logo de ${name || siteConfig.name}`} />
      {name || siteConfig.name}
    </span>
  );
}
