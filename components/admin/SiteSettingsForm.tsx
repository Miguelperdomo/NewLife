"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Control } from "react-hook-form";
import { AlertTriangle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteSettingsFormSchema, type SiteSettingsFormValues } from "@/lib/admin/schemas";
import { useUnsavedChangesWarning } from "@/lib/admin/useUnsavedChangesWarning";
import { FormField, FormSection, inputClass, textareaClass } from "./form/FormField";
import { ImageUploadField } from "./form/ImageUploadField";
import { SocialRowField } from "./form/SocialRowField";

type ColorFieldName = "primaryColor" | "accentColor";

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

/** Mini vista previa en vivo: usa los colores elegidos ANTES de guardar, para que no haya sorpresas. */
function ColorPreview({ primaryColor, accentColor }: { primaryColor: string; accentColor: string }) {
  const isValid = (hex: string) => /^#[0-9a-fA-F]{6}$/.test(hex);
  const primary = isValid(primaryColor) ? primaryColor : "#7c3aed";
  const accent = isValid(accentColor) ? accentColor : "#f59e0b";

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Vista previa</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm"
          style={{ backgroundColor: primary }}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Botón principal
        </span>
        <span
          className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm"
          style={{ backgroundColor: accent }}
        >
          Acento
        </span>
        <span className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold" style={{ borderColor: primary, color: primary }}>
          Etiqueta
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">Así se verán los botones y detalles en todo el sitio al guardar.</p>
    </div>
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
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    defaultValues,
  });

  useUnsavedChangesWarning(isDirty && !isSubmitting);

  const primaryColor = watch("primaryColor");
  const accentColor = watch("accentColor");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Información general">
        <FormField label="Nombre de la iglesia" htmlFor="churchName" required error={errors.churchName?.message}>
          <input id="churchName" className={inputClass} {...register("churchName")} />
        </FormField>

        <FormField
          label="Descripción"
          htmlFor="description"
          hint="También se usa como texto debajo del título grande de la portada (Hero)."
        >
          <textarea id="description" rows={3} className={textareaClass} {...register("description")} />
        </FormField>

        <FormField
          label="Título grande de la portada"
          htmlFor="heroTagline"
          error={errors.heroTagline?.message}
          hint='La frase grande que aparece primero al entrar al sitio, ej. «Una nueva vida comienza aquí».'
        >
          <input id="heroTagline" className={inputClass} {...register("heroTagline")} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Logo" htmlFor="logoUrl" hint="Reemplaza el logo en todo el sitio (encabezado y pie de página).">
            <ImageUploadField control={control} name="logoUrl" folder="settings" />
          </FormField>
          <FormField label="Favicon" htmlFor="faviconUrl" hint="Ícono que aparece en la pestaña del navegador.">
            <ImageUploadField control={control} name="faviconUrl" folder="settings" />
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
            hint="Solo números, con código de país. Ej. 573001234567. Lo usan todos los botones de WhatsApp del sitio."
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

      <FormSection title="Apariencia" description="Estos colores sí cambian el sitio público en cuanto guardas.">
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField control={control} name="primaryColor" label="Color principal" error={errors.primaryColor?.message} />
          <ColorField control={control} name="accentColor" label="Color de acento" error={errors.accentColor?.message} />
        </div>

        <ColorPreview primaryColor={primaryColor} accentColor={accentColor} />

        <FormField label="Imagen de fondo/portada" htmlFor="coverImageUrl">
          <ImageUploadField control={control} name="coverImageUrl" folder="settings" />
        </FormField>
      </FormSection>

      <FormSection title="Redes sociales" description="Activa o desactiva cada red y define su enlace.">
        <SocialRowField control={control} urlName="facebookUrl" enabledName="facebookEnabled" label="Facebook" placeholder="https://facebook.com/..." />
        <SocialRowField control={control} urlName="instagramUrl" enabledName="instagramEnabled" label="Instagram" placeholder="https://instagram.com/..." />
        <SocialRowField control={control} urlName="youtubeUrl" enabledName="youtubeEnabled" label="YouTube" placeholder="https://youtube.com/..." />
        <SocialRowField control={control} urlName="tiktokUrl" enabledName="tiktokEnabled" label="TikTok" placeholder="https://tiktok.com/..." />
        <SocialRowField
          control={control}
          urlName="whatsappSocialUrl"
          enabledName="whatsappSocialEnabled"
          label="WhatsApp"
          placeholder="Déjalo vacío para usar el WhatsApp principal y el mensaje predeterminado."
        />
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

      <FormSection
        title="SEO y compartir"
        description="Lo que se ve cuando alguien comparte el link del sitio en WhatsApp, Facebook, etc."
      >
        <FormField
          label="Título para compartir"
          htmlFor="seoTitle"
          error={errors.seoTitle?.message}
          hint="Máximo 70 caracteres. Si lo dejas vacío, se usa el nombre de la iglesia."
        >
          <input id="seoTitle" className={inputClass} {...register("seoTitle")} />
        </FormField>
        <FormField
          label="Descripción para compartir"
          htmlFor="seoDescription"
          error={errors.seoDescription?.message}
          hint="Máximo 160 caracteres."
        >
          <textarea id="seoDescription" rows={2} className={textareaClass} {...register("seoDescription")} />
        </FormField>
        <FormField label="Imagen para compartir" htmlFor="seoImageUrl" hint="Se muestra como vista previa del link.">
          <ImageUploadField control={control} name="seoImageUrl" folder="settings" />
        </FormField>
      </FormSection>

      <FormSection
        title="Página Nosotros"
        description="El contenido de /nosotros — Quiénes somos, Misión, Visión y Valores se muestran con el mismo diseño, solo cambia el texto."
      >
        <FormField label="Foto de portada" htmlFor="aboutImageUrl" hint="Se muestra grande, arriba de la página. Opcional.">
          <ImageUploadField control={control} name="aboutImageUrl" folder="nosotros" />
        </FormField>
        <FormField label="Quiénes somos" htmlFor="aboutQuienesSomos">
          <textarea id="aboutQuienesSomos" rows={3} className={textareaClass} {...register("aboutQuienesSomos")} />
        </FormField>
        <FormField label="Misión" htmlFor="aboutMision">
          <textarea id="aboutMision" rows={3} className={textareaClass} {...register("aboutMision")} />
        </FormField>
        <FormField label="Visión" htmlFor="aboutVision">
          <textarea id="aboutVision" rows={3} className={textareaClass} {...register("aboutVision")} />
        </FormField>
        <FormField label="Valores" htmlFor="aboutValores">
          <textarea id="aboutValores" rows={3} className={textareaClass} {...register("aboutValores")} />
        </FormField>
      </FormSection>

      <FormSection
        title="Widget de Ayuda — textos"
        description="El título, descripción y botón del widget flotante. Las opciones (Donación, Ropa, etc.) se editan aparte, más abajo."
      >
        <FormField label="Título" htmlFor="helpTitle" hint='Ej. «Sé parte de algo más grande».'>
          <input id="helpTitle" className={inputClass} {...register("helpTitle")} />
        </FormField>
        <FormField label="Descripción" htmlFor="helpDescription">
          <textarea id="helpDescription" rows={2} className={textareaClass} {...register("helpDescription")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Texto del botón" htmlFor="helpCtaLabel" hint='Ej. «Quiero ayudar».'>
            <input id="helpCtaLabel" className={inputClass} {...register("helpCtaLabel")} />
          </FormField>
          <FormField label="Título de la lista de opciones" htmlFor="helpOptionsTitle" hint='Ej. «¿Cómo quieres ayudar?».'>
            <input id="helpOptionsTitle" className={inputClass} {...register("helpOptionsTitle")} />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Donaciones"
        description="Se muestran en el widget de Ayuda cuando alguien elige «Donación económica»."
      >
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded" {...register("donationsEnabled")} />
          Mostrar datos de donación en el sitio
        </label>

        <div className="rounded-2xl border border-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-800">Cuenta bancaria</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Solo si tienes una cuenta en un banco tradicional (Bancolombia, Davivienda, BBVA...). No pongas
            «Nequi» ni «Daviplata» aquí — esas van en su propio bloque más abajo.
          </p>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <FormField label="Banco" htmlFor="bankName" hint="Ej. Bancolombia, Davivienda...">
              <input id="bankName" className={inputClass} {...register("bankName")} />
            </FormField>
            <FormField label="Tipo de cuenta" htmlFor="bankAccountType" hint="Ej. Ahorros o Corriente.">
              <input id="bankAccountType" className={inputClass} {...register("bankAccountType")} />
            </FormField>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label="Número de cuenta" htmlFor="bankAccountNumber">
              <input id="bankAccountNumber" className={inputClass} {...register("bankAccountNumber")} />
            </FormField>
            <FormField label="Titular de la cuenta" htmlFor="bankAccountHolder">
              <input id="bankAccountHolder" className={inputClass} {...register("bankAccountHolder")} />
            </FormField>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-800">Billeteras digitales</p>
          <p className="mt-0.5 text-xs text-slate-500">Solo el número de celular asociado a cada una.</p>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <FormField label="Nequi" htmlFor="nequiNumber" hint="Déjalo vacío si no tienes.">
              <input id="nequiNumber" className={inputClass} {...register("nequiNumber")} />
            </FormField>
            <FormField label="Daviplata" htmlFor="daviplataNumber" hint="Déjalo vacío si no tienes.">
              <input id="daviplataNumber" className={inputClass} {...register("daviplataNumber")} />
            </FormField>
          </div>
        </div>
      </FormSection>

      <FormSection title="Sistema">
        <label className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded" {...register("maintenanceMode")} />
          <span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-800">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Modo mantenimiento
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-amber-700">
              Al activarlo, todo el sitio público muestra un aviso de &ldquo;volvemos pronto&rdquo; en vez del
              contenido normal. El panel administrativo sigue funcionando para que puedas desactivarlo cuando
              termines.
            </span>
          </span>
        </label>
      </FormSection>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
