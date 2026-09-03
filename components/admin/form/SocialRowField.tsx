"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { inputClass } from "./FormField";

/**
 * Fila "activar red + URL" reutilizada por cualquier formulario del admin
 * que administre redes sociales (Configuración, Pastores...) — genérica
 * sobre el tipo de formulario vía FieldPath, para no atarla a un solo schema.
 */
export function SocialRowField<TFieldValues extends FieldValues>({
  control,
  urlName,
  enabledName,
  label,
  placeholder,
}: {
  control: Control<TFieldValues>;
  urlName: FieldPath<TFieldValues>;
  enabledName: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
}) {
  const inputId = String(urlName);

  return (
    <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4">
      <label className="flex w-40 shrink-0 items-center gap-2 text-sm font-semibold text-slate-700" htmlFor={inputId}>
        <Controller
          control={control}
          name={enabledName}
          render={({ field }) => (
            <input
              type="checkbox"
              className="h-4 w-4 rounded"
              checked={Boolean(field.value)}
              onChange={(event) => field.onChange(event.target.checked)}
              aria-label={`Activar ${label}`}
            />
          )}
        />
        {label}
      </label>
      <Controller
        control={control}
        name={urlName}
        render={({ field }) => (
          <input
            id={inputId}
            type="text"
            value={typeof field.value === "string" ? field.value : ""}
            onChange={(event) => field.onChange(event.target.value)}
            placeholder={placeholder}
            className={`${inputClass} mt-0 flex-1`}
          />
        )}
      />
    </div>
  );
}
