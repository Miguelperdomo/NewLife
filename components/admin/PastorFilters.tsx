import { Search } from "lucide-react";
import type { PastorStatus } from "@/lib/admin/types";

export interface PastorFiltersValue {
  query: string;
  status: "all" | PastorStatus;
}

const statusOptions: { label: string; value: PastorFiltersValue["status"] }[] = [
  { label: "Todos", value: "all" },
  { label: "Activos", value: "active" },
  { label: "Archivados", value: "archived" },
];

/** Mismo patrón visual que MinistryFilters.tsx: buscador + select de estado. */
export function PastorFilters({
  value,
  onChange,
}: {
  value: PastorFiltersValue;
  onChange: (value: PastorFiltersValue) => void;
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
          placeholder="Buscar por nombre o cargo..."
          aria-label="Buscar pastores"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <select
        value={value.status}
        onChange={(event) => onChange({ ...value, status: event.target.value as PastorFiltersValue["status"] })}
        aria-label="Filtrar por estado"
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
