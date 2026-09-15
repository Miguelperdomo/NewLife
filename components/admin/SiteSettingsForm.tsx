"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Control } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { siteSettingsFormSchema, type SiteSettingsFormValues } from "@/lib/admin/schemas";
import { FormField, FormSection, inputClass, textareaClass } from "./form/FormField";
import { SocialRowField } from "./form/SocialRowField";

type ColorFieldName = "primaryColor" | "secondaryColor" | "accentColor";

function ColorField({
  control,
  name,
  label,
  error,
}: {
  control: Control<SiteSettingsFormValues>;
  name: ColorFieldName;
  label: string;
  error?: string;
}) {
  return (
    <FormField label={label} htmlFor={name} required error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="mt-1.5 flex items-center gap-3">
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(field.value) ? field.value : "#000000"}
              onChange={(event) => field.onChange(event.target.value)}
              aria-label={`Selector de ${label.toLowerCase()}`}
              className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
            />
            <input
              id={name}
              type="text"
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
              placeholder="#7c3aed"
              className={inputClass}
            />
          </div>
        )}
      />
    </FormField>
  );
}

export function SiteSettingsForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues: SiteSettingsFormValues;
  onSubmit: (values: SiteSettingsFormValues) => void | Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Información general">
        <FormField label="Nombre de la iglesia" htmlFor="churchName" required error={errors.churchName?.message}>
          <input id="churchName" className={inputClass} {...register("churchName")} />
        </FormField>

        <FormField label="Descripción" htmlFor="description">
          <textarea id="description" rows={3} className={textareaClass} {...register("description")} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Logo" htmlFor="logoUrl" hint="Ruta o URL de la imagen.">
            <input id="logoUrl" className={inputClass} placeholder="/img/logo-principal.jpeg" {...register("logoUrl")} />
          </FormField>
          <FormField label="Favicon" htmlFor="faviconUrl" hint="Ruta o URL del ícono.">
            <input id="faviconUrl" className={inputClass} placeholder="/favicon.ico" {...register("faviconUrl")} />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Teléfono" htmlFor="phone">
            <input id="phone" className={inputClass} {...register("phone")} />
          </FormField>
          <FormField
            label="WhatsApp principal"
            htmlFor="whatsappNumber"
            required
            error={errors.whatsappNumber?.message}
            hint="Solo números, con código de país. Ej. 573001234567."
          >
            <input id="whatsappNumber" className={inputClass} {...register("whatsappNumber")} />
          </FormField>
        </div>

        <FormField label="Correo" htmlFor="email">
          <input id="email" type="text" className={inputClass} {...register("email")} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Dirección principal" htmlFor="address">
            <input id="address" className={inputClass} {...register("address")} />
          </FormField>
          <FormField label="Ciudad" htmlFor="city">
            <input id="city" className={inputClass} {...register("city")} />
          </FormField>
        </div>

        <FormField label="Horarios generales" htmlFor="generalSchedule" hint="Ej. «Domingos 7:30 a. m., 10:30 a. m. y 5:00 p. m.»">
          <input id="generalSchedule" className={inputClass} {...register("generalSchedule")} />
        </FormField>
      </FormSection>

      <FormSection
        title="Apariencia"
        description="Los colores y el fondo todavía no cambian el sitio público automáticamente — quedan guardados, listos para cuando conectemos esta capa."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <ColorField control={control} name="primaryColor" label="Color principal" error={errors.primaryColor?.message} />
          <ColorField control={control} name="secondaryColor" label="Color secundario" error={errors.secondaryColor?.message} />
          <ColorField control={control} name="accentColor" label="Color de acento" error={errors.accentColor?.message} />
        </div>

        <FormField label="Imagen de fondo/portada" htmlFor="coverImageUrl" hint="Ruta o URL de la imagen.">
          <input id="coverImageUrl" className={inputClass} {...register("coverImageUrl")} />
        </FormField>

        <FormField label="Texto del footer" htmlFor="footerText">
          <input id="footerText" className={inputClass} {...register("footerText")} />
        </FormField>
      </FormSection>

      <FormSection title="Redes sociales" description="Activa o desactiva cada red y define su enlace.">
        <SocialRowField control={control} urlName="facebookUrl" enabledName="facebookEnabled" label="Facebook" placeholder="https://facebook.com/..." />
        <SocialRowField control={control} urlName="instagramUrl" enabledName="instagramEnabled" label="Instagram" placeholder="https://instagram.com/..." />
        <SocialRowField control={control} urlName="youtubeUrl" enabledName="youtubeEnabled" label="YouTube" placeholder="https://youtube.com/..." />
        <SocialRowField control={control} urlName="tiktokUrl" enabledName="tiktokEnabled" label="TikTok" placeholder="https://tiktok.com/..." />
        <SocialRowField control={control} urlName="whatsappSocialUrl" enabledName="whatsappSocialEnabled" label="WhatsApp" placeholder="https://wa.me/..." />
      </FormSection>

      <FormSection title="Página principal" description="Qué secciones se muestran en el Home.">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded" {...register("showMinistries")} />
            Mostrar sección de Ministerios
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded" {...register("showLive")} />
            Mostrar En Vivo
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded" {...register("showEvents")} />
            Mostrar Eventos
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded" {...register("showNews")} />
            Mostrar Noticias
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded" {...register("showAgenda")} />
            Mostrar Agenda
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded" {...register("showCampuses")} />
            Mostrar Sedes
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded" {...register("showHelp")} />
            Mostrar Ayuda y donaciones
          </label>
        </div>
      </FormSection>

      <FormSection title="Contacto y WhatsApp">
        <FormField
          label="Mensaje predeterminado de WhatsApp"
          htmlFor="whatsappDefaultMessage"
          required
          error={errors.whatsappDefaultMessage?.message}
          hint='Ej. «Hola, quiero recibir información sobre New Life.»'
        >
          <textarea id="whatsappDefaultMessage" rows={2} className={textareaClass} {...register("whatsappDefaultMessage")} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Número de atención" htmlFor="supportPhone" hint="Opcional, si es distinto al WhatsApp principal.">
            <input id="supportPhone" className={inputClass} {...register("supportPhone")} />
          </FormField>
          <FormField label="Correo de contacto" htmlFor="contactEmail" hint="Opcional, si es distinto al correo general.">
            <input id="contactEmail" type="text" className={inputClass} {...register("contactEmail")} />
          </FormField>
        </div>
      </FormSection>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
