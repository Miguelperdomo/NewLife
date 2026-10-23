"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { getPastors } from "@/lib/pastors";
import { useAdminMinistries } from "@/lib/admin/useAdminMinistries";
import { campusFormSchema, type CampusFormValues } from "@/lib/admin/schemas";
import { useUnsavedChangesWarning } from "@/lib/admin/useUnsavedChangesWarning";
import { FormField, FormSection, inputClass } from "./form/FormField";
import { ImageUploadField } from "./form/ImageUploadField";
import { MapLocationField } from "./form/MapLocationField";
import { ScheduleListField } from "./form/ScheduleListField";

export const campusFormDefaults: CampusFormValues = {
  name: "",
  fullName: "",
  address: "",
  city: "",
  mapQuery: "",
  imageSrc: "",
  isMain: false,
  leadPastorSlug: "",
  whatsappNumber: "",
  schedules: [],
  hasParking: false,
  isWheelchairAccessible: false,
  hasChildcare: false,
};

export function CampusForm({
  defaultValues,
  submitLabel = "Crear sede",
  onSubmit,
  onPreview,
  existingCities = [],
}: {
  defaultValues?: Partial<CampusFormValues>;
  submitLabel?: string;
  onSubmit: (values: CampusFormValues) => void | Promise<void>;
  onPreview: (values: CampusFormValues) => void;
  /** Ciudades que ya usan otras sedes — se sugieren al escribir, para que "Ibagué" no termine escrita de 3 formas distintas por error de dedo. */
  existingCities?: string[];
}) {
  const pastors = getPastors();
  const { ministries } = useAdminMinistries();

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CampusFormValues>({
    resolver: zodResolver(campusFormSchema),
    defaultValues: { ...campusFormDefaults, ...defaultValues },
  });

  useUnsavedChangesWarning(isDirty && !isSubmitting);

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
          hint="Opcional. Si no subes ninguna, se usa una portada de New Life."
        >
          <ImageUploadField control={control} name="imageSrc" folder="sedes" />
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
        <FormField
          label="Dirección"
          htmlFor="address"
          required
          error={errors.address?.message}
          hint="Ej. «Calle 42 #15-30, Ibagué» — la que se muestra en el sitio."
        >
          <input id="address" className={inputClass} {...register("address")} />
        </FormField>

        <FormField
          label="Ciudad (opcional)"
          htmlFor="city"
          hint='Ej. «Ibagué», «Girardot», «Bucaramanga». Si ya existe, elígela de la lista que aparece al escribir, en vez de escribirla de memoria — así no queda "Ibagué" y "ibague" como si fueran dos ciudades distintas.'
        >
          <input id="city" list="existing-cities" className={inputClass} {...register("city")} />
          <datalist id="existing-cities">
            {existingCities.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </FormField>

        <FormField
          label="Ubicación en Google Maps"
          htmlFor="mapQuery"
          required
          error={errors.mapQuery?.message}
          hint="Pega el link para compartir de Google Maps (el de la app o el navegador) — abajo puedes confirmar en el mapa antes de guardar. También puedes escribir la dirección o un plus code."
        >
          <MapLocationField control={control} />
        </FormField>
      </FormSection>

      <FormSection title="Liderazgo y contacto" description="Ambos campos son opcionales.">
        <FormField label="Apóstol/líder responsable" htmlFor="leadPastorSlug">
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

      <FormSection
        title="Horarios de servicio"
        description="Se muestran en la página de esta sede y en la Agenda del Home. Agrega cuantos necesites."
      >
        <ScheduleListField control={control} errors={errors.schedules} ministries={ministries} />
      </FormSection>

      <FormSection title="Comodidades" description="Aparecen como íconos en la página pública de esta sede.">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="h-4 w-4 rounded" {...register("hasParking")} />
            Parqueadero
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="h-4 w-4 rounded" {...register("isWheelchairAccessible")} />
            Accesible en silla de ruedas
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="h-4 w-4 rounded" {...register("hasChildcare")} />
            Cuidado de niños
          </label>
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
