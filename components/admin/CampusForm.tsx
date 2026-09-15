"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { getPastors } from "@/lib/content";
import { campusFormSchema, type CampusFormValues } from "@/lib/admin/schemas";
import { FormField, FormSection, inputClass } from "./form/FormField";

export const campusFormDefaults: CampusFormValues = {
  name: "",
  fullName: "",
  address: "",
  mapQuery: "",
  imageSrc: "",
  isMain: false,
  leadPastorSlug: "",
  whatsappNumber: "",
};

export function CampusForm({
  defaultValues,
  submitLabel = "Crear sede",
  onSubmit,
  onPreview,
}: {
  defaultValues?: Partial<CampusFormValues>;
  submitLabel?: string;
  onSubmit: (values: CampusFormValues) => void | Promise<void>;
  onPreview: (values: CampusFormValues) => void;
}) {
  const pastors = getPastors();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CampusFormValues>({
    resolver: zodResolver(campusFormSchema),
    defaultValues: { ...campusFormDefaults, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Información básica">
        <FormField
          label="Nombre corto"
          htmlFor="name"
          required
          error={errors.name?.message}
          hint="Ej. «Sede Vasconia» — el que se usa en menús y tarjetas."
        >
          <input id="name" className={inputClass} {...register("name")} />
        </FormField>

        <FormField
          label="Nombre completo"
          htmlFor="fullName"
          required
          error={errors.fullName?.message}
          hint="Ej. «New Life Church Vasconia» — el que se muestra en el detalle de la sede."
        >
          <input id="fullName" className={inputClass} {...register("fullName")} />
        </FormField>

        <FormField
          label="Imagen"
          htmlFor="imageSrc"
          hint="Opcional. Ruta o URL de la foto — sin subida de archivos todavía. Si se deja vacío, se usa una portada de New Life."
        >
          <input
            id="imageSrc"
            className={inputClass}
            placeholder="/sedes/mi-sede.jpg"
            {...register("imageSrc")}
          />
        </FormField>

        <FormField label="Sede principal" htmlFor="isMain">
          <label className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
            <input id="isMain" type="checkbox" className="h-4 w-4 rounded" {...register("isMain")} />
            Marcar como sede principal
          </label>
          <p className="mt-1 text-xs text-slate-400">
            Solo puede haber una — marcarla aquí desmarca automáticamente cualquier otra.
          </p>
        </FormField>
      </FormSection>

      <FormSection
        title="Ubicación"
        description="La dirección se muestra en el sitio; el texto de búsqueda es lo que se usa para abrir Google Maps."
      >
        <FormField label="Dirección" htmlFor="address" required error={errors.address?.message}>
          <input id="address" className={inputClass} {...register("address")} />
        </FormField>

        <FormField
          label="Texto de búsqueda en Google Maps"
          htmlFor="mapQuery"
          required
          error={errors.mapQuery?.message}
          hint="Dirección o plus code — cuanto más preciso, mejor ubica el punto en el mapa."
        >
          <input id="mapQuery" className={inputClass} {...register("mapQuery")} />
        </FormField>
      </FormSection>

      <FormSection title="Liderazgo y contacto" description="Ambos campos son opcionales.">
        <FormField label="Pastor/líder responsable" htmlFor="leadPastorSlug">
          <select id="leadPastorSlug" className={inputClass} {...register("leadPastorSlug")}>
            <option value="">Sin especificar</option>
            {pastors.map((pastor) => (
              <option key={pastor.slug} value={pastor.slug}>
                {pastor.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="WhatsApp de esta sede"
          htmlFor="whatsappNumber"
          hint="Si se deja vacío, usa el WhatsApp general de New Life."
        >
          <input id="whatsappNumber" className={inputClass} {...register("whatsappNumber")} />
        </FormField>
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
