"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// SVG queda fuera a propósito: puede llevar <script> incrustado (riesgo de
// XSS si esa imagen se abre directo), y no lo necesitamos aquí.
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Subida real de imágenes a Supabase Storage (bucket "media", ver
 * lib/admin/../../.. storage_bucket.sql). Controlado (Controller) porque el
 * valor lo pone la subida asíncrona, no lo que la persona escribe — mismo
 * motivo que el <select> de Sede en EventForm.
 */
export function ImageUploadField<T extends FieldValues>({
  control,
  name,
  folder,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = typeof field.value === "string" ? field.value : "";

        async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;

          // `accept="image/*"` en el input es solo una sugerencia del
          // navegador — se puede saltar fácilmente, así que se revisa de
          // verdad acá antes de subir nada.
          if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Solo se permiten imágenes JPG, PNG, WEBP o GIF.");
            return;
          }
          if (file.size > MAX_FILE_SIZE_BYTES) {
            setError("La imagen no puede pesar más de 5 MB.");
            return;
          }

          setError(null);
          setUploading(true);
          try {
            const supabase = createClient();
            const extension = file.name.split(".").pop() || "jpg";
            const path = `${folder}/${crypto.randomUUID()}.${extension}`;

            const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
              cacheControl: "3600",
              upsert: false,
            });
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("media").getPublicUrl(path);
            field.onChange(data.publicUrl);
          } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
          } finally {
            setUploading(false);
          }
        }

        return (
          <div className="mt-1.5 space-y-3">
            {value && (
              <div className="relative h-32 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:w-56">
                <Image src={value} alt="" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => field.onChange("")}
                  aria-label="Quitar imagen"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white transition-colors hover:bg-slate-900"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}

            <label
              className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50 ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Upload className="h-4 w-4" aria-hidden="true" />
              )}
              {uploading ? "Subiendo…" : value ? "Cambiar imagen" : "Subir imagen"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>

            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
          </div>
        );
      }}
    />
  );
}
