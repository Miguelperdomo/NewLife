"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Newspaper, Search, Users } from "lucide-react";
import { useAdminCampuses } from "@/lib/admin/useAdminCampuses";
import { useAdminContent } from "@/lib/admin/useAdminContent";
import { useAdminMinistries } from "@/lib/admin/useAdminMinistries";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: typeof Users;
}

const MAX_RESULTS = 8;

/**
 * Buscador global del panel — un solo campo para encontrar cualquier
 * ministerio, sede, evento o noticia por su nombre, sin tener que entrar
 * módulo por módulo. Junta lo que ya cargaron los hooks de cada módulo (no
 * pide nada nuevo a Supabase) y filtra en el navegador.
 */
export function GlobalSearch() {
  const router = useRouter();
  const { ministries } = useAdminMinistries();
  const { campuses } = useAdminCampuses();
  const { events, news } = useAdminContent();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allResults = useMemo<SearchResult[]>(
    () => [
      ...ministries.map((ministry) => ({
        id: `ministerio-${ministry.id}`,
        title: ministry.name,
        subtitle: "Ministerio",
        href: `/admin/ministerios/${ministry.id}/editar`,
        icon: Users,
      })),
      ...campuses.map((campus) => ({
        id: `sede-${campus.id}`,
        title: campus.name,
        subtitle: "Sede",
        href: `/admin/sedes/${campus.id}/editar`,
        icon: MapPin,
      })),
      ...events.map((event) => ({
        id: `evento-${event.id}`,
        title: event.title,
        subtitle: "Evento",
        href: `/admin/contenido/${event.id}/editar?type=event`,
        icon: Calendar,
      })),
      ...news.map((article) => ({
        id: `noticia-${article.id}`,
        title: article.title,
        subtitle: "Noticia",
        href: `/admin/contenido/${article.id}/editar?type=news`,
        icon: Newspaper,
      })),
    ],
    [ministries, campuses, events, news]
  );

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return allResults.filter((item) => item.title.toLowerCase().includes(trimmed)).slice(0, MAX_RESULTS);
  }, [allResults, query]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function handleSelect(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar ministerio, sede, evento o noticia..."
          aria-label="Buscar en todo el panel"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
          {results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(result.href)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <result.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900">{result.title}</span>
                      <span className="block text-xs text-slate-400">{result.subtitle}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-sm text-slate-500">Sin resultados para «{query}».</p>
          )}
        </div>
      )}
    </div>
  );
}
