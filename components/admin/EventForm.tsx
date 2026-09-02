"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { getCampuses, getMinistries } from "@/lib/content";
import { eventFormSchema, type EventFormValues } from "@/lib/admin/schemas";
import type { MinistryAudience } from "@/lib/admin/types";
import { FormField, FormSection, inputClass, textareaClass } from "./form/FormField";

const defaultAudience: MinistryAudience = { mode: "general" };

export const eventFormDefaults: EventFormValues = {
  title: "",
  description: "",
  imageSrc: "",
  status: "draft",
  publishAt: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  startTime: "",
  endTime: "",
  campus: "",
  location: "",
  audience: defaultAudience,
  registrationUrl: "",
  whatsappNumber: "",
  capacity: undefined,
  featured: false,
};

export function EventForm({
  defaultValues,
  submitLabel = "Crear evento",
  onSubmit,
  onPreview,
}: {
  defaultValues?: Partial<EventFormValues>;
  submitLabel?: string;
  onSubmit: (values: EventFormValues) => void;
  onPreview: (values: EventFormValues) => void;
}) {
  const ministries = getMinistries();
  const campuses = getCampuses();

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { ...eventFormDefaults, ...defaultValues },
  });

  const status = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Información básica">
        <FormField label="Título" htmlFor="title" required error={errors.title?.message}>
          <input id="title" className={inputClass} {...register("title")} />
        </FormField>

        <FormField
          label="Descripción"
          htmlFor="description"
          required
          error={errors.description?.message}
        >
          <textarea id="description" rows={4} className={textareaClass} {...register("description")} />
        </FormField>

        <FormField
          label="Imagen"
          htmlFor="imageSrc"
          hint="Opcional. Ruta o URL de la imagen — sin subida de archivos todavía. Si se deja vacío, se usa una portada de New Life."
        >
          <input id="imageSrc" className={inputClass} placeholder="/img/mi-evento.jpg" {...register("imageSrc")} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Estado" htmlFor="status">
            <select id="status" className={inputClass} {...register("status")}>
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="scheduled">Programado</option>
              <option value="archived">Archivado</option>
            </select>
          </FormField>

          {status === "scheduled" && (
            <FormField
              label="Fecha/hora de publicación"
              htmlFor="publishAt"
              required
              error={errors.publishAt?.message}
            >
              <input
                id="publishAt"
                type="datetime-local"
                className={inputClass}
                {...register("publishAt")}
              />
            </FormField>
          )}

          <FormField label="Evento destacado" htmlFor="featured">
            <label className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
              <input id="featured" type="checkbox" className="h-4 w-4 rounded" {...register("featured")} />
              Mostrar como destacado
            </label>
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Fecha y horario"
        description="Un evento puede durar un solo día o varios — deja la fecha de finalización vacía si es de un solo día."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Fecha de inicio"
            htmlFor="startDate"
            required
            error={errors.startDate?.message}
          >
            <input id="startDate" type="date" className={inputClass} {...register("startDate")} />
          </FormField>
          <FormField
            label="Fecha de finalización"
            htmlFor="endDate"
            hint="Opcional"
            error={errors.endDate?.message}
          >
            <input id="endDate" type="date" className={inputClass} {...register("endDate")} />
          </FormField>
          <FormField label="Hora de inicio" htmlFor="startTime" hint="Opcional">
            <input id="startTime" type="time" className={inputClass} {...register("startTime")} />
          </FormField>
          <FormField label="Hora de finalización" htmlFor="endTime" hint="Opcional">
            <input id="endTime" type="time" className={inputClass} {...register("endTime")} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Ubicación" description="Ambos campos son opcionales.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Sede" htmlFor="campus">
            <select id="campus" className={inputClass} {...register("campus")}>
              <option value="">Sin especificar</option>
              {campuses.map((campus) => (
                <option key={campus.slug} value={campus.slug}>
                  {campus.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Lugar / dirección" htmlFor="location">
            <input id="location" className={inputClass} placeholder="Salón juvenil" {...register("location")} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="¿A quién está dirigido este evento?">
        <Controller
          control={control}
          name="audience"
          render={({ field }) => (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <AudienceOption
                  label="Todos los ministerios"
                  checked={field.value.mode === "all"}
                  onChange={() => field.onChange({ mode: "all" })}
                />
                <AudienceOption
                  label="Seleccionar ministerios"
                  checked={field.value.mode === "specific"}
                  onChange={() => field.onChange({ mode: "specific", ministrySlugs: [] })}
                />
                <AudienceOption
                  label="General (sin ministerio)"
                  checked={field.value.mode === "general"}
                  onChange={() => field.onChange({ mode: "general" })}
                />
              </div>

              {field.value.mode === "specific" && (
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
                  {ministries.map((ministry) => {
                    const current = field.value.mode === "specific" ? field.value.ministrySlugs : [];
                    const checked = current.includes(ministry.slug);
                    return (
                      <label key={ministry.slug} className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded"
                          checked={checked}
                          onChange={(event) => {
                            const next = event.target.checked
                              ? [...current, ministry.slug]
                              : current.filter((slug) => slug !== ministry.slug);
                            field.onChange({ mode: "specific", ministrySlugs: next });
                          }}
                        />
                        {ministry.name}
                      </label>
                    );
                  })}
                </div>
              )}
              {errors.audience && "ministrySlugs" in errors.audience && (
                <p className="text-xs font-medium text-red-600">
                  {(errors.audience as { ministrySlugs?: { message?: string } }).ministrySlugs?.message}
                </p>
              )}
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Otros campos" description="Todos opcionales.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Enlace de inscripción" htmlFor="registrationUrl">
            <input id="registrationUrl" className={inputClass} {...register("registrationUrl")} />
          </FormField>
          <FormField
            label="WhatsApp para este evento"
            htmlFor="whatsappNumber"
            hint="Si se deja vacío, usa el WhatsApp general de New Life."
          >
            <input id="whatsappNumber" className={inputClass} {...register("whatsappNumber")} />
          </FormField>
          <FormField label="Cupos / capacidad" htmlFor="capacity">
            <input id="capacity" type="number" min={1} className={inputClass} {...register("capacity")} />
          </FormField>
        </div>
      </FormSection>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onPreview(getValues())}
        >
          Vista previa
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function AudienceOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input type="radio" className="h-4 w-4" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}
