"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { newsFormSchema, type NewsFormValues } from "@/lib/admin/schemas";
import { FormField, FormSection, inputClass, textareaClass } from "./form/FormField";

export const newsFormDefaults: NewsFormValues = {
  title: "",
  summary: "",
  content: "",
  imageSrc: "",
  status: "draft",
  publishAt: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  author: "",
  category: "",
  featured: false,
};

export function NewsForm({
  defaultValues,
  submitLabel = "Crear noticia",
  onSubmit,
  onPreview,
}: {
  defaultValues?: Partial<NewsFormValues>;
  submitLabel?: string;
  onSubmit: (values: NewsFormValues) => void;
  onPreview: (values: NewsFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: { ...newsFormDefaults, ...defaultValues },
  });

  const status = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection title="Información básica">
        <FormField label="Título" htmlFor="title" required error={errors.title?.message}>
          <input id="title" className={inputClass} {...register("title")} />
        </FormField>

        <FormField label="Resumen" htmlFor="summary" hint="Opcional — se muestra en las tarjetas.">
          <textarea id="summary" rows={2} className={textareaClass} {...register("summary")} />
        </FormField>

        <FormField label="Contenido" htmlFor="content" required error={errors.content?.message}>
          <textarea id="content" rows={6} className={textareaClass} {...register("content")} />
        </FormField>

        <FormField
          label="Imagen"
          htmlFor="imageSrc"
          hint="Opcional. Ruta o URL de la imagen — sin subida de archivos todavía. Si se deja vacío, se usa una portada de New Life."
        >
          <input id="imageSrc" className={inputClass} placeholder="/img/mi-noticia.jpg" {...register("imageSrc")} />
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
        </div>
      </FormSection>

      <FormSection title="Información adicional" description="Todos los campos son opcionales.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Fecha de publicación"
            htmlFor="publishedAt"
            required
            error={errors.publishedAt?.message}
          >
            <input id="publishedAt" type="date" className={inputClass} {...register("publishedAt")} />
          </FormField>
          <FormField label="Categoría" htmlFor="category">
            <input id="category" className={inputClass} placeholder="Anuncio" {...register("category")} />
          </FormField>
          <FormField label="Autor" htmlFor="author">
            <input id="author" className={inputClass} {...register("author")} />
          </FormField>
          <FormField label="Noticia destacada" htmlFor="featured">
            <label className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
              <input id="featured" type="checkbox" className="h-4 w-4 rounded" {...register("featured")} />
              Sí, mostrar como destacada
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
