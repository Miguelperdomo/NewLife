import { cn } from "@/lib/utils";

// transición ondulada entre secciones en vez de un corte plano.
// className = color de fondo de la franja, fillClassName = color de la ola
export function WaveDivider({
  className,
  fillClassName = "text-slate-950",
}: {
  className?: string;
  fillClassName?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("relative h-10 w-full sm:h-16", className)}>
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className={cn("absolute inset-0 h-full w-full", fillClassName)}
      >
        <path d="M0,0 C360,100 1080,0 1440,60 L1440,0 L0,0 Z" fill="currentColor" />
      </svg>
    </div>
  );
}
