"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/admin/slug";
import { ministryFormSchema, type MinistryFormValues } from "@/lib/admin/schemas";
import { FormField, FormSection, inputClass, textareaClass } from "./form/FormField";

export const ministryFormDefaults: MinistryFormValues = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  imageSrc: "",
  leader: "",
  whatsapp: "",
  meetingSchedule: "",
  meetingLocation: "",
  status: "active",
  displayOrder: "1",
  showPublicly: true,
};

export function MinistryForm({
  defaultValues,
  submitLabel = "Crear ministerio",
  onSubmit,
  onPreview,
}: {
  defaultValues?: Partial<MinistryFormValues>;
  submitLabel?: string;
  onSubmit: (values: MinistryFormValues) => void;
  onPreview: (values: MinistryFormValues) => void;
}) {
  // En edición no se debe pisar un slug ya existente solo por cambiar el
  // nombre — el auto-slug solo sigue al nombre mientras se está creando.
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MinistryFormValues>({
    resolver: zodResolver(ministryFormSchema),
    defaultValues: { ...ministryFormDefaults, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Información básica">
        <FormField label="Nombre" htmlFor="name" required error={errors.name?.message}>
          <input
            id="name"
            className={inputClass}
            {...register("name", {
              onChange: (event) => {
                if (!slugTouched) {
                  setValue("slug", slugify(event.target.value), { shouldValidate: true });
                }
              },
            })}
          />
        </FormField>

        <FormField
          label="Slug"
          htmlFor="slug"
          required
          error={errors.slug?.message}
          hint="Se genera automáticamente desde el nombre — puedes editarlo manualmente. Debe ser único."
        >
          <input
            id="slug"
            className={inputClass}
            {...register("slug", { onChange: () => setSlugTouched(true) })}
          />
        </FormField>

        <FormField
          label="Descripción corta"
          htmlFor="shortDescription"
          required
          error={errors.shortDescription?.message}
          hint="Se muestra en las tarjetas de /ministerios. Máximo 160 caracteres."
        >
          <textarea id="shortDescription" rows={2} className={textareaClass} {...register("shortDescription")} />
        </FormField>

        <FormField
          label="Descripción completa"
          htmlFor="description"
          required
          error={errors.description?.message}
        >
          <textarea id="description" rows={5} className={textareaClass} {...register("description")} />
        </FormField>
      </FormSection>

      <FormSection
        title="Imagen"
        description="Opcional. Ruta o URL de la imagen — sin subida de archivos todavía. Si se deja vacío, se usa un color de marca. Preparado para conectarse a un servicio de medios más adelante."
      >
        <FormField label="Imagen del ministerio" htmlFor="imageSrc">
          <input
            id="imageSrc"
            className={inputClass}
            placeholder="/img/mi-ministerio.jpg"
            {...register("imageSrc")}
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Responsable"
        description="Por ahora es un campo de texto libre — más adelante podría conectarse a un directorio de personas."
      >
        <FormField label="Líder / responsable" htmlFor="leader">
          <input id="leader" className={inputClass} {...register("leader")} />
        </FormField>
      </FormSection>

      <FormSection title="Contacto">
        <FormField
          label="WhatsApp"
          htmlFor="whatsapp"
          hint="Si se deja vacío, la capa pública usaría el WhatsApp general de New Life."
        >
          <input id="whatsapp" className={inputClass} {...register("whatsapp")} />
        </FormField>
      </FormSection>

      <FormSection title="Reuniones">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Horario de reunión" htmlFor="meetingSchedule" hint="Ej. «Sábados · 4:00 p. m.»">
            <input id="meetingSchedule" className={inputClass} {...register("meetingSchedule")} />
          </FormField>
          <FormField label="Lugar de reunión" htmlFor="meetingLocation" hint="Ej. «Sede Principal»">
            <input id="meetingLocation" className={inputClass} {...register("meetingLocation")} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Configuración">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Estado" htmlFor="status">
            <select id="status" className={inputClass} {...register("status")}>
              <option value="active">Activo</option>
              <option value="archived">Archivado</option>
            </select>
          </FormField>

          <FormField
            label="Orden de aparición"
            htmlFor="displayOrder"
            required
            error={errors.displayOrder?.message}
          >
            <input id="displayOrder" type="number" min={1} className={inputClass} {...register("displayOrder")} />
          </FormField>

          <FormField label="Mostrar públicamente" htmlFor="showPublicly">
            <label className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
              <input id="showPublicly" type="checkbox" className="h-4 w-4 rounded" {...register("showPublicly")} />
              Visible en /ministerios
            </label>
          </FormField>
        </div>
      </FormSection>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => onPreview(getValues())}>
          Vista previa
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
