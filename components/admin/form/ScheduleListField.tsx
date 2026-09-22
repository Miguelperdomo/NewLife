"use client";

import { Controller, useFieldArray, type Control, type FieldErrors } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { CampusFormValues } from "@/lib/admin/schemas";
import { DAY_OF_WEEK_LABELS } from "@/lib/schedule";
import { inputClass } from "./FormField";

/**
 * Lista de horarios recurrentes de una sede (día + hora + título), editable
 * agregando/quitando filas — reemplaza el horario fijo que antes vivía en
 * data/agenda.ts. Se guarda completa (reemplaza todo) al enviar el
 * formulario, ver syncCampusSchedules en lib/admin/campuses.ts.
 */
export function ScheduleListField({
  control,
  errors,
}: {
  control: Control<CampusFormValues>;
  errors?: FieldErrors<CampusFormValues>["schedules"];
}) {
  const { fields, append, remove } = useFieldArray({ control, name: "schedules" });

  return (
    <div className="space-y-3">
      {fields.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
          Todavía no has agregado ningún horario.
        </p>
      )}

      {fields.map((field, index) => {
        const rowErrors = errors?.[index];
        return (
          <div key={field.id} className="space-y-2.5 rounded-xl border border-slate-200 p-3">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2.5">
              <Controller
                control={control}
                name={`schedules.${index}.dayOfWeek`}
                render={({ field: dayField }) => (
                  <select className={inputClass} value={dayField.value} onChange={dayField.onChange}>
                    <option value="">Día</option>
                    {DAY_OF_WEEK_LABELS.map((label, day) => (
                      <option key={label} value={day}>
                        {label}
                      </option>
                    ))}
                  </select>
                )}
              />
              <Controller
                control={control}
                name={`schedules.${index}.time`}
                render={({ field: timeField }) => (
                  <input
                    type="time"
                    className={inputClass}
                    value={timeField.value}
                    onChange={timeField.onChange}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Quitar este horario"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <Controller
              control={control}
              name={`schedules.${index}.title`}
              render={({ field: titleField }) => (
                <input
                  className={inputClass}
                  placeholder="Ej. Culto principal"
                  value={titleField.value}
                  onChange={titleField.onChange}
                />
              )}
            />
            {(rowErrors?.dayOfWeek?.message || rowErrors?.time?.message || rowErrors?.title?.message) && (
              <p className="text-xs font-medium text-red-600">
                {rowErrors?.dayOfWeek?.message || rowErrors?.time?.message || rowErrors?.title?.message}
              </p>
            )}

            <Controller
              control={control}
              name={`schedules.${index}.description`}
              render={({ field: descriptionField }) => (
                <input
                  className={inputClass}
                  placeholder="Descripción (opcional), ej. «Servicio de la mañana»"
                  value={descriptionField.value}
                  onChange={descriptionField.onChange}
                />
              )}
            />
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => append({ dayOfWeek: "0", time: "09:00", title: "", description: "" })}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Agregar horario
      </button>
    </div>
  );
}
