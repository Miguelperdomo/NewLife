"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { pastorProfileFormSchema, type PastorProfileFormValues } from "@/lib/admin/schemas";
import type { AdminPastorProfile } from "@/lib/admin/types";
import { usePastorProfile } from "@/lib/admin/usePastorProfile";
import { useUnsavedChangesWarning } from "@/lib/admin/useUnsavedChangesWarning";
import { FormField, FormSection, inputClass, textareaClass } from "./form/FormField";
import { ImageUploadField } from "./form/ImageUploadField";
import { SocialRowField } from "./form/SocialRowField";

function toFormValues(profile: AdminPastorProfile): PastorProfileFormValues {
  return {
    name: profile.name,
    role: profile.role ?? "",
    bio: profile.bio ?? "",
    imageSrc: profile.imageSrc ?? "",
    whatsappNumber: profile.whatsappNumber ?? "",
    facebookUrl: profile.facebookUrl ?? "",
    facebookEnabled: profile.facebookEnabled,
    instagramUrl: profile.instagramUrl ?? "",
    instagramEnabled: profile.instagramEnabled,
  };
}

function orUndefined(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function Form({
  defaultValues,
  onSave,
}: {
  defaultValues: PastorProfileFormValues;
  onSave: (input: Omit<AdminPastorProfile, "updatedAt">) => Promise<AdminPastorProfile>;
}) {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PastorProfileFormValues>({
    resolver: zodResolver(pastorProfileFormSchema),
    defaultValues,
  });

  useUnsavedChangesWarning(isDirty && !isSubmitting);

  async function onSubmit(values: PastorProfileFormValues) {
    await onSave({
      name: values.name,
      role: orUndefined(values.role),
      bio: orUndefined(values.bio),
      imageSrc: orUndefined(values.imageSrc),
      whatsappNumber: orUndefined(values.whatsappNumber),
      facebookUrl: orUndefined(values.facebookUrl),
      facebookEnabled: values.facebookEnabled,
      instagramUrl: orUndefined(values.instagramUrl),
      instagramEnabled: values.instagramEnabled,
    });
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

      <FormField label="Nombre" htmlFor="name" required error={errors.name?.message}>
        <input id="name" className={inputClass} {...register("name")} />
      </FormField>

      <FormField label="Cargo/rol" htmlFor="role" hint='Ej. «Apóstol · Fundador y Pastor Principal».'>
        <input id="role" className={inputClass} {...register("role")} />
      </FormField>

      <FormField label="Foto" htmlFor="imageSrc">
        <ImageUploadField control={control} name="imageSrc" folder="pastor" />
      </FormField>

      <FormField label="Biografía" htmlFor="bio" hint="Puedes separar en párrafos dejando una línea en blanco.">
        <textarea id="bio" rows={5} className={textareaClass} {...register("bio")} />
      </FormField>

      <FormField
        label="WhatsApp del pastor"
        htmlFor="whatsappNumber"
        hint="Opcional. Si se deja vacío, la página del pastor usa el WhatsApp general de New Life."
      >
        <input id="whatsappNumber" className={inputClass} {...register("whatsappNumber")} />
      </FormField>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-700">Redes sociales</p>
        <SocialRowField
          control={control}
          urlName="facebookUrl"
          enabledName="facebookEnabled"
          label="Facebook"
          placeholder="https://facebook.com/..."
        />
        <SocialRowField
          control={control}
          urlName="instagramUrl"
          enabledName="instagramEnabled"
          label="Instagram"
          placeholder="https://instagram.com/..."
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}

/**
 * Perfil del pastor principal — sección propia en Configuración, con su
 * propio guardado (tabla `pastor`, aparte de `site_settings`). New Life solo
 * tiene un pastor a propósito, así que es un formulario simple, no un
 * módulo con lista/crear/archivar.
 */
export function PastorProfileForm() {
  const { profile, isReady, update } = usePastorProfile();

  return (
    <FormSection title="Pastor principal" description="Nombre, foto y biografía que se muestran en /pastores.">
      {isReady && profile ? (
        <Form key={profile.updatedAt} defaultValues={toFormValues(profile)} onSave={update} />
      ) : (
        <p className="text-sm text-slate-500">Cargando…</p>
      )}
    </FormSection>
  );
}
