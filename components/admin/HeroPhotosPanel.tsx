"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { ArrowDown, ArrowUp, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { heroPhotosFormSchema, type HeroPhotosFormValues } from "@/lib/admin/schemas";
import type { AdminHeroPhoto } from "@/lib/admin/types";
import { useHeroPhotos } from "@/lib/admin/useHeroPhotos";
import { useUnsavedChangesWarning } from "@/lib/admin/useUnsavedChangesWarning";
import { FormField, FormSection, inputClass } from "./form/FormField";
import { ImageUploadField } from "./form/ImageUploadField";

function PhotosForm({
  defaultPhotos,
  onSave,
}: {
  defaultPhotos: AdminHeroPhoto[];
  onSave: (photos: AdminHeroPhoto[]) => Promise<void>;
}) {
  const [saved, setSaved] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<HeroPhotosFormValues>({
    resolver: zodResolver(heroPhotosFormSchema),
    defaultValues: { photos: defaultPhotos },
  });
  const { fields, append, remove, move } = useFieldArray({ control, name: "photos" });

  useUnsavedChangesWarning(isDirty && !isSubmitting);

  async function onSubmit(values: HeroPhotosFormValues) {
    await onSave(values.photos);
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
          Todavía no has subido ninguna foto — mientras tanto, la portada muestra la imagen de respaldo de siempre.
        </p>
      )}

      {fields.map((field, index) => {
        const rowErrors = errors.photos?.[index];
        return (
          <div key={field.id} className="flex gap-3 rounded-xl border border-slate-200 p-3">
            <div className="flex shrink-0 flex-col items-center gap-1 pt-1.5">
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                aria-label="Mover esta foto más arriba"
                className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === fields.length - 1}
                aria-label="Mover esta foto más abajo"
                className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 space-y-2.5">
              <ImageUploadField control={control} name={`photos.${index}.imageUrl`} folder="hero" />
              <FormField label="Texto alternativo (opcional)" htmlFor={`hero-photo-alt-${index}`} hint="Describe la foto, para accesibilidad.">
                <input
                  id={`hero-photo-alt-${index}`}
                  className={inputClass}
                  placeholder="Ej. «Congregación en el culto dominical»"
                  {...register(`photos.${index}.alt`)}
                />
              </FormField>
              {rowErrors?.imageUrl?.message && (
                <p className="text-xs font-medium text-red-600">{rowErrors.imageUrl.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              aria-label="Quitar esta foto"
              className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-xl text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => append({ imageUrl: "", alt: "" })}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Agregar foto
      </button>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}

// guarda en hero_photos aparte de site_settings. Con 0-1 foto se ve igual que antes, con 2+ rota sola
export function HeroPhotosPanel() {
  const { photos, isReady, save } = useHeroPhotos();

  return (
    <FormSection
      title="Carrusel de fotos — Portada"
      description="Fotos reales de New Life que rotan solas en el fondo de la portada del Home. Agrega las que quieras — con 2 o más, cambian solas cada pocos segundos; con el orden de la lista, usa las flechas para reordenar."
    >
      {isReady ? (
        <PhotosForm defaultPhotos={photos} onSave={save} />
      ) : (
        <p className="text-sm text-slate-500">Cargando…</p>
      )}
    </FormSection>
  );
}
