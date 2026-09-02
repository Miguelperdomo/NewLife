import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600",
  secondary:
    "bg-accent-500 text-brand-950 hover:bg-accent-600 focus-visible:outline-accent-500",
  outline:
    "border border-white/40 text-white hover:bg-white/10 focus-visible:outline-white",
  ghost:
    "text-brand-700 hover:bg-brand-50 focus-visible:outline-brand-600",
};

const sizeClasses: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm sm:text-base",
};

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentProps<typeof Link>, "className" | "children"> & {
    href: string;
  };

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  );
}
