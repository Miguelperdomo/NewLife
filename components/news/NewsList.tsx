"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { NewsCard } from "./NewsCard";
import { NewsFilters, type NewsFilterOption } from "./NewsFilters";
import type { NewsArticle } from "@/lib/types";

/**
 * Único componente con estado del listado de noticias: guarda la búsqueda y
 * la categoría activa (derivada de article.category) — mismo patrón que
 * EventList para eventos.
 */
export function NewsList({ articles }: { articles: NewsArticle[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");

  const options: NewsFilterOption[] = useMemo(() => {
    const categories = Array.from(
      new Set(articles.map((article) => article.category).filter((value): value is string => Boolean(value)))
    );
    return [{ label: "Todas", value: "todas" }, ...categories.map((value) => ({ label: value, value }))];
  }, [articles]);

  const filtered = articles
    .filter((article) => category === "todas" || article.category === category)
    .filter((article) => article.title.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar noticias..."
            aria-label="Buscar noticias"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {options.length > 1 && <NewsFilters options={options} active={category} onChange={setCategory} />}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, index) => (
            <NewsCard key={article.slug} article={article} index={index} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
          No hay noticias que coincidan con tu búsqueda.
        </p>
      )}
    </div>
  );
}
