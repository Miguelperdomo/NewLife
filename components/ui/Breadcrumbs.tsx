import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Container } from "./Container";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Migas de pan para páginas internas — Inicio siempre se antepone. Incluye
 * BreadcrumbList (JSON-LD) para que buscadores muestren la ruta en los
 * resultados, además de ayudar a la orientación de quien navega.
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems: BreadcrumbItem[] = [{ label: "Inicio", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <nav aria-label="Ruta de navegación" className="border-b border-slate-100 bg-white">
      <Container>
        <ol className="flex flex-wrap items-center gap-1.5 py-3 text-xs text-slate-500">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isHome = index === 0;

            return (
              <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden="true" />}
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={isLast ? "max-w-[160px] truncate font-medium text-slate-700 sm:max-w-xs" : ""}
                  >
                    {isHome ? <Home className="h-3.5 w-3.5" aria-hidden="true" /> : item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="shrink-0 transition-colors hover:text-brand-600">
                    {isHome ? <Home className="h-3.5 w-3.5" aria-hidden="true" /> : item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
