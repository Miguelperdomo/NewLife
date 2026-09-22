"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { firstTimeCardsFormSchema, type FirstTimeCardsFormValues } from "@/lib/admin/schemas";
import type { AdminFirstTimeCard } from "@/lib/admin/types";
import { useFirstTimeCards } from "@/lib/admin/useFirstTimeCards";
import { useUnsavedChangesWarning } from "@/lib/admin/useUnsavedChangesWarning";
import { FIRST_TIME_ICON_OPTIONS } from "@/lib/firstTimeIcons";
import { FormSection, inputClass, textareaClass } from "./form/FormField";

function CardsForm({
  defaultCards,
  onSave,
}: {
  defaultCards: AdminFirstTimeCard[];
  onSave: (cards: AdminFirstTimeCard[]) => Promise<void>;
}) {
  const [saved, setSaved] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FirstTimeCardsFormValues>({
    resolver: zodResolver(firstTimeCardsFormSchema),
    defaultValues: { cards: defaultCards },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "cards" });

  useUnsavedChangesWarning(isDirty && !isSubmitting);

  async function onSubmit(values: FirstTimeCardsFormValues) {
    await onSave(values.cards);
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
          Todavía no has agregado ninguna tarjeta.
        </p>
      )}

      {fields.map((field, index) => {
        const rowErrors = errors.cards?.[index];
        return (
          <div key={field.id} className="space-y-2.5 rounded-xl border border-slate-200 p-3">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[180px_1fr_auto]">
              <select className={inputClass} {...register(`cards.${index}.icon`)}>
                {FIRST_TIME_ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                className={inputClass}
                placeholder="Título, ej. «Qué esperar»"
                {...register(`cards.${index}.title`)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Quitar esta tarjeta"
                className="flex h-11 w-11 shrink-0 items-center justify-center justify-self-end rounded-xl text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <textarea
              rows={2}
              className={textareaClass}
              placeholder="Descripción"
              {...register(`cards.${index}.description`)}
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
        onClick={() => append({ icon: "sparkles", title: "", description: "" })}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Agregar tarjeta
      </button>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}

/**
 * Tarjetas de "¿Es tu primera vez?" del Home — sección propia en
 * Configuración, con su propio guardado (tabla `first_time_cards`, aparte de
 * `site_settings`, por eso no puede vivir dentro del formulario grande de
 * SiteSettingsForm — un <form> no puede ir anidado dentro de otro).
 */
export function FirstTimeCardsPanel() {
  const { cards, isReady, save } = useFirstTimeCards();

  return (
    <FormSection
      title="«¿Es tu primera vez?» — tarjetas del Home"
      description="Qué esperar, niños, parqueadero... agrega, edita o quita las que quieras."
    >
      {isReady ? (
        <CardsForm defaultCards={cards} onSave={save} />
      ) : (
        <p className="text-sm text-slate-500">Cargando…</p>
      )}
    </FormSection>
  );
}
