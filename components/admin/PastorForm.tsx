"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/admin/slug";
import { pastorFormSchema, type PastorFormValues } from "@/lib/admin/schemas";
import { FormField, FormSection, inputClass, textareaClass } from "./form/FormField";
import { SocialRowField } from "./form/SocialRowField";

export const pastorFormDefaults: PastorFormValues = {
  name: "",
  slug: "",
  role: "",
  bio: "",
  imageSrc: "",
  tier: "1",
  status: "active",
  showPublicly: true,
  facebookUrl: "",
  facebookEnabled: false,
  instagramUrl: "",
  instagramEnabled: false,
  youtubeUrl: "",
  youtubeEnabled: false,
  tiktokUrl: "",
  tiktokEnabled: false,
  whatsappUrl: "",
  whatsappEnabled: false,
};

export function PastorForm({
  defaultValues,
  submitLabel = "Crear pastor",
  onSubmit,
  onPreview,
}: {
  defaultValues?: Partial<PastorFormValues>;
  submitLabel?: string;
  onSubmit: (values: PastorFormValues) => void;
  onPreview: (values: PastorFormValues) => void;
}) {
  // En edición no se debe pisar un slug ya existente solo por cambiar el
  // nombre — el auto-slug solo sigue al nombre mientras se está creando.
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PastorFormValues>({
    resolver: zodResolver(pastorFormSchema),
    defaultValues: { ...pastorFormDefaults, ...defaultValues },
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
          <input id="slug" className={inputClass} {...register("slug", { onChange: () => setSlugTouched(true) })} />
        </FormField>

        <FormField label="Cargo" htmlFor="role" required error={errors.role?.message} hint='Ej. «Apóstol · Fundador y Pastor Principal».'>
          <input id="role" className={inputClass} {...register("role")} />
        </FormField>

        <FormField label="Biografía" htmlFor="bio" required error={errors.bio?.message}>
          <textarea id="bio" rows={5} className={textareaClass} {...register("bio")} />
        </FormField>
      </FormSection>

      <FormSection
        title="Imagen"
        description="Opcional. Ruta o URL de la foto — sin subida de archivos todavía. Si se deja vacío, se usa un color de marca."
      >
        <FormField label="Foto del pastor" htmlFor="imageSrc">
          <input id="imageSrc" className={inputClass} placeholder="/img/pastor.jpg" {...register("imageSrc")} />
        </FormField>
      </FormSection>

      <FormSection title="Redes sociales" description="Activa o desactiva cada red y define su enlace.">
        <SocialRowField control={control} urlName="facebookUrl" enabledName="facebookEnabled" label="Facebook" placeholder="https://facebook.com/..." />
        <SocialRowField control={control} urlName="instagramUrl" enabledName="instagramEnabled" label="Instagram" placeholder="https://instagram.com/..." />
        <SocialRowField control={control} urlName="youtubeUrl" enabledName="youtubeEnabled" label="YouTube" placeholder="https://youtube.com/..." />
        <SocialRowField control={control} urlName="tiktokUrl" enabledName="tiktokEnabled" label="TikTok" placeholder="https://tiktok.com/..." />
        <SocialRowField control={control} urlName="whatsappUrl" enabledName="whatsappEnabled" label="WhatsApp" placeholder="https://wa.me/..." />
      </FormSection>

      <FormSection title="Configuración">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            label="Nivel en la pirámide"
            htmlFor="tier"
            required
            error={errors.tier?.message}
            hint="1 = cabeza, 2 = siguiente nivel..."
          >
            <input id="tier" type="number" min={1} className={inputClass} {...register("tier")} />
          </FormField>

          <FormField label="Estado" htmlFor="status">
            <select id="status" className={inputClass} {...register("status")}>
              <option value="active">Activo</option>
              <option value="archived">Archivado</option>
            </select>
          </FormField>

          <FormField label="Mostrar públicamente" htmlFor="showPublicly">
            <label className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
              <input id="showPublicly" type="checkbox" className="h-4 w-4 rounded" {...register("showPublicly")} />
              Visible en /pastores
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
