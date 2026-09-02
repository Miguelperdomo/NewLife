import { CalendarDays, Newspaper } from "lucide-react";
import type { AdminContentType } from "@/lib/admin/types";

const options: { type: AdminContentType; label: string; description: string; icon: typeof CalendarDays }[] = [
  {
    type: "event",
    label: "Evento",
    description: "Reuniones, retiros, servicios especiales — con fecha, hora y lugar.",
    icon: CalendarDays,
  },
  {
    type: "news",
    label: "Noticia",
    description: "Anuncios, reflexiones, actualizaciones — un artículo para leer.",
    icon: Newspaper,
  },
];

export function ContentTypePicker({
  onSelect,
}: {
  onSelect: (type: AdminContentType) => void;
}) {
  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-slate-900">¿Qué quieres crear?</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {options.map(({ type, label, description, icon: Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-left transition-colors hover:border-brand-400 hover:bg-brand-50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-lg font-bold text-slate-900">{label}</span>
            <span className="text-sm text-slate-500">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
