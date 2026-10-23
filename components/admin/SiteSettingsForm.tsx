"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Control } from "react-hook-form";
import { AlertTriangle, Loader2, MessageCircle } from "lucide-react";
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
    <form onSubmit={handleSubmit(onSubmit)} className="focus-mode-form space-y-6">
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

        <FormField
          label="Año de fundación"
          htmlFor="foundingYear"
          error={errors.foundingYear?.message}
          hint='Si lo llenas, la portada muestra «X años sirviendo» junto al número de sedes y ministerios. Déjalo vacío para no mostrarlo.'
        >
          <input id="foundingYear" inputMode="numeric" maxLength={4} className={inputClass} {...register("foundingYear")} />
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
      </FormSection>

      <FormSection title="Apariencia" description="Estos colores sí cambian el sitio público en cuanto guardas." defaultOpen={false}>
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField control={control} name="primaryColor" label="Color principal" error={errors.primaryColor?.message} />
          <ColorField control={control} name="accentColor" label="Color de acento" error={errors.accentColor?.message} />
        </div>

        <ColorPreview primaryColor={primaryColor} accentColor={accentColor} />

        <FormField label="Imagen de fondo/portada" htmlFor="coverImageUrl">
          <ImageUploadField control={control} name="coverImageUrl" folder="settings" />
        </FormField>
      </FormSection>

      <FormSection title="Redes sociales" description="Activa o desactiva cada red y define su enlace." defaultOpen={false}>
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

      <FormSection title="Página principal" description="Qué secciones se muestran en el Home." defaultOpen={false}>
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

      <FormSection title="Contacto y WhatsApp" defaultOpen={false}>
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
       defaultOpen={false}>
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
       defaultOpen={false}>
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
        title="«¿Es tu primera vez?» — encabezado"
        description="El texto de arriba de esta sección del Home. Las tarjetas se editan aparte, más abajo."
       defaultOpen={false}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Etiqueta" htmlFor="firstTimeEyebrow" hint='Ej. «Primera vez».'>
            <input id="firstTimeEyebrow" className={inputClass} {...register("firstTimeEyebrow")} />
          </FormField>
          <FormField label="Texto del botón" htmlFor="firstTimeCtaLabel" hint='Ej. «Planifica tu visita».'>
            <input id="firstTimeCtaLabel" className={inputClass} {...register("firstTimeCtaLabel")} />
          </FormField>
        </div>
        <FormField label="Título" htmlFor="firstTimeTitle" hint='Ej. «¿Es tu primera vez en New Life?».'>
          <input id="firstTimeTitle" className={inputClass} {...register("firstTimeTitle")} />
        </FormField>
        <FormField label="Descripción" htmlFor="firstTimeDescription">
          <textarea id="firstTimeDescription" rows={2} className={textareaClass} {...register("firstTimeDescription")} />
        </FormField>
      </FormSection>

      {/*
        "Encabezados de secciones" — comentado a pedido del usuario (no se
        borró nada): la etiqueta/título/descripción de cada sección (Home +
        página completa) seguían guardadas en la base de datos y siguen
        usándose tal cual en el sitio público, solo se quitó la posibilidad
        de editarlas desde el panel. Para reactivarlo, descomentar este
        bloque — los campos del formulario (register, defaultValues, schema)
        no se tocaron.

      <FormSection
        title="Encabezados de secciones"
        description="La etiqueta, título y descripción de cada sección del Home y su página completa (Ministerios, Sedes, Eventos, Noticias, Apóstol). Un mismo texto se usa en los dos lugares."
       defaultOpen={false}>
        <div className="rounded-2xl border border-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-800">Ministerios</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <FormField label="Etiqueta" htmlFor="ministriesEyebrow">
              <input id="ministriesEyebrow" className={inputClass} {...register("ministriesEyebrow")} />
            </FormField>
            <FormField label="Título" htmlFor="ministriesTitle">
              <input id="ministriesTitle" className={inputClass} {...register("ministriesTitle")} />
            </FormField>
          </div>
          <FormField label="Descripción" htmlFor="ministriesDescription">
            <textarea id="ministriesDescription" rows={2} className={textareaClass} {...register("ministriesDescription")} />
          </FormField>
        </div>

        <div className="rounded-2xl border border-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-800">Sedes</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <FormField label="Etiqueta" htmlFor="campusesEyebrow">
              <input id="campusesEyebrow" className={inputClass} {...register("campusesEyebrow")} />
            </FormField>
            <FormField label="Título" htmlFor="campusesTitle">
              <input id="campusesTitle" className={inputClass} {...register("campusesTitle")} />
            </FormField>
          </div> 
          <FormField label="Descripción" htmlFor="campusesDescription">
            <textarea id="campusesDescription" rows={2} className={textareaClass} {...register("campusesDescription")} />
          </FormField>
        </div>

        <div className="rounded-2xl border border-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-800">Eventos</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <FormField label="Etiqueta" htmlFor="eventsEyebrow">
              <input id="eventsEyebrow" className={inputClass} {...register("eventsEyebrow")} />
            </FormField>
            <FormField label="Título" htmlFor="eventsTitle">
              <input id="eventsTitle" className={inputClass} {...register("eventsTitle")} />
            </FormField>
          </div>
          <FormField label="Descripción" htmlFor="eventsDescription">
            <textarea id="eventsDescription" rows={2} className={textareaClass} {...register("eventsDescription")} />
          </FormField>
        </div>

        <div className="rounded-2xl border border-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-800">Noticias</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <FormField label="Etiqueta" htmlFor="newsEyebrow">
              <input id="newsEyebrow" className={inputClass} {...register("newsEyebrow")} />
            </FormField>
            <FormField label="Título" htmlFor="newsTitle">
              <input id="newsTitle" className={inputClass} {...register("newsTitle")} />
            </FormField>
          </div>
          <FormField label="Descripción" htmlFor="newsDescription">
            <textarea id="newsDescription" rows={2} className={textareaClass} {...register("newsDescription")} />
          </FormField>
        </div>

        <div className="rounded-2xl border border-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-800">Apóstol</p>
          <p className="mt-0.5 text-xs text-slate-500">Solo aparece en /pastores, no tiene resumen en el Home.</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <FormField label="Etiqueta" htmlFor="pastorsEyebrow">
              <input id="pastorsEyebrow" className={inputClass} {...register("pastorsEyebrow")} />
            </FormField>
            <FormField label="Título" htmlFor="pastorsTitle">
              <input id="pastorsTitle" className={inputClass} {...register("pastorsTitle")} />
            </FormField>
          </div>
          <FormField label="Descripción" htmlFor="pastorsDescription">
            <textarea id="pastorsDescription" rows={2} className={textareaClass} {...register("pastorsDescription")} />
          </FormField>
        </div>
      </FormSection>
      */}

      <FormSection
        title="Bloque «En vivo» — miniatura"
        description="La imagen que se muestra en el Home junto al botón para ver la transmisión."
        defaultOpen={false}
      >
        <FormField label="Imagen" htmlFor="liveThumbnailUrl">
          <ImageUploadField control={control} name="liveThumbnailUrl" folder="settings" />
        </FormField>
        <FormField label="Texto alternativo" htmlFor="liveThumbnailAlt" hint="Describe la imagen, para accesibilidad.">
          <input id="liveThumbnailAlt" className={inputClass} {...register("liveThumbnailAlt")} />
        </FormField>
      </FormSection>

      <FormSection
        title="Legal"
        description="Se publican en /privacidad y /terminos, con link automático en el pie de página."
        defaultOpen={false}
      >
        <FormField
          label="Política de privacidad"
          htmlFor="privacyPolicy"
          hint='Si lo dejas vacío, se usa un texto genérico básico. Admite formato simple: "## Título" para un encabezado, "**texto**" para negrilla, y líneas que empiecen con "- " o "1. " para listas — separa párrafos con una línea en blanco.'
        >
          <textarea id="privacyPolicy" rows={8} className={textareaClass} {...register("privacyPolicy")} />
        </FormField>
        <FormField
          label="Términos y condiciones"
          htmlFor="termsOfService"
          hint='Si lo dejas vacío, se usa un texto genérico básico. Admite formato simple: "## Título" para un encabezado, "**texto**" para negrilla, y líneas que empiecen con "- " o "1. " para listas — separa párrafos con una línea en blanco.'
        >
          <textarea id="termsOfService" rows={8} className={textareaClass} {...register("termsOfService")} />
        </FormField>
      </FormSection>

      <FormSection title="Sistema" defaultOpen={false}>
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

      <FormSection
        title="Widget de Ayuda — encabezado"
        description="El título, descripción y botón del widget flotante que aparece en todo el sitio. Justo después de guardar esto, más abajo en la página, está la lista de formas de ayudar (Ropa, Alimentos, Voluntariado...) — ahí se agregan tantas como quieras, cada una con su propio botón de guardar."
        defaultOpen={false}
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
        description='Si la activas, "Donación económica" aparece SOLA como la primera opción del widget de Ayuda, ya conectada a estos datos — no hace falta (ni se debe) agregarla a mano en la lista de opciones de más abajo.'
        defaultOpen={false}
      >
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded" {...register("donationsEnabled")} />
          Mostrar datos de donación en el sitio
        </label>

        <FormField label="Título" htmlFor="donationTitle" hint='Ej. «Donación económica».'>
          <input id="donationTitle" className={inputClass} {...register("donationTitle")} />
        </FormField>
        <FormField
          label="Texto corto (en la lista de opciones)"
          htmlFor="donationTeaser"
          hint='Ej. «Apoya proyectos y necesidades de nuestra comunidad».'
        >
          <input id="donationTeaser" className={inputClass} {...register("donationTeaser")} />
        </FormField>
        <FormField
          label="Texto de la pantalla de donación"
          htmlFor="donationDescription"
          hint='Ej. «Gracias por tu generosidad. Puedes hacer tu aporte con cualquiera de estos datos».'
        >
          <textarea id="donationDescription" rows={2} className={textareaClass} {...register("donationDescription")} />
        </FormField>

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

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
