"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { helpOptionsFormSchema, type HelpOptionsFormValues } from "@/lib/admin/schemas";
import type { AdminHelpOption } from "@/lib/admin/types";
import { useHelpOptions } from "@/lib/admin/useHelpOptions";
import { useUnsavedChangesWarning } from "@/lib/admin/useUnsavedChangesWarning";
import { HELP_OPTION_ICON_OPTIONS } from "@/lib/helpOptionIcons";
import { FormSection, inputClass, textareaClass } from "./form/FormField";

function OptionsForm({
  defaultOptions,
  onSave,
}: {
  defaultOptions: AdminHelpOption[];
  onSave: (options: AdminHelpOption[]) => Promise<void>;
}) {
  const [saved, setSaved] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<HelpOptionsFormValues>({
    resolver: zodResolver(helpOptionsFormSchema),
    defaultValues: { options: defaultOptions },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "options" });

  useUnsavedChangesWarning(isDirty && !isSubmitting);

  async function onSubmit(values: HelpOptionsFormValues) {
    await onSave(values.options);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Guardado correctamente.
        </div>
      )}

      {fields.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
          Todavía no has agregado ninguna opción.
        </p>
      )}

      {fields.map((field, index) => {
        const rowErrors = errors.options?.[index];
        return (
          <div key={field.id} className="space-y-2.5 rounded-xl border border-slate-200 p-3">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[200px_1fr_auto]">
              <select className={inputClass} {...register(`options.${index}.icon`)}>
                {/* si el ícono guardado ya no existe en el catálogo, se agrega aparte para no perder el valor real */}
                {!HELP_OPTION_ICON_OPTIONS.some((option) => option.value === field.icon) && field.icon && (
                  <option value={field.icon}>{field.icon} (ícono anterior)</option>
                )}
                {HELP_OPTION_ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                className={inputClass}
                placeholder="Título, ej. «Donación económica»"
                {...register(`options.${index}.title`)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Quitar esta opción"
                className="flex h-11 w-11 shrink-0 items-center justify-center justify-self-end rounded-xl text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <textarea
              rows={2}
              className={textareaClass}
              placeholder="Descripción"
              {...register(`options.${index}.description`)}
            />
            {(rowErrors?.icon?.message || rowErrors?.title?.message || rowErrors?.description?.message) && (
              <p className="text-xs font-medium text-red-600">
                {rowErrors?.icon?.message || rowErrors?.title?.message || rowErrors?.description?.message}
              </p>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => append({ icon: "handHeart", title: "", description: "" })}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Agregar opción
      </button>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}

// guarda en su propia tabla (help_options), el texto fijo del widget vive en SiteSettingsForm
export function HelpOptionsPanel() {
  const { options, isReady, save } = useHelpOptions();

  return (
    <FormSection
      title="Widget de Ayuda — formas de ayudar"
      description="Agrega tantas como quieras (Ropa, Alimentos, Voluntariado...) — cada una abre WhatsApp con un mensaje ya escrito. La «Donación económica» NO va aquí: se activa arriba, en Configuración > Donaciones, y aparece sola conectada a tu cuenta bancaria/Nequi/Daviplata."
    >
      {isReady ? (
        <OptionsForm defaultOptions={options} onSave={save} />
      ) : (
        <p className="text-sm text-slate-500">Cargando…</p>
      )}
    </FormSection>
  );
}
