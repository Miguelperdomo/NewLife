import { Search } from "lucide-react";
import type { ContentStatus } from "@/lib/admin/types";

export interface ContentFiltersValue {
  query: string;
  type: "all" | "event" | "news";
  status: "all" | ContentStatus;
}

const statusOptions: { label: string; value: ContentFiltersValue["status"] }[] = [
  { label: "Todos los estados", value: "all" },
  { label: "Borrador", value: "draft" },
  { label: "Publicado", value: "published" },
  { label: "Programado", value: "scheduled" },
  { label: "Archivado", value: "archived" },
];

export function ContentFilters({
  value,
  onChange,
}: {
  value: ContentFiltersValue;
  onChange: (value: ContentFiltersValue) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value.query}
          onChange={(event) => onChange({ ...value, query: event.target.value })}
          placeholder="Buscar por título..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <select
        value={value.type}
        onChange={(event) =>
          onChange({ ...value, type: event.target.value as ContentFiltersValue["type"] })
        }
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      >
        <option value="all">Todos los tipos</option>
        <option value="event">Evento</option>
        <option value="news">Noticia</option>
      </select>

      <select
        value={value.status}
        onChange={(event) =>
          onChange({ ...value, status: event.target.value as ContentFiltersValue["status"] })
        }
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
