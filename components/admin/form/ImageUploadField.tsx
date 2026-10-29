"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Link2, Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// sin SVG: puede traer <script> incrustado, riesgo de XSS
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// el plan free de Supabase Storage es de 1GB, así que comprimimos antes de subir
// (GIF se deja igual para no perder la animación)
const MAX_DIMENSION_PX = 1920;
const JPEG_QUALITY = 0.82;

async function compressImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
  if (!blob || blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}

// sube a Supabase Storage (bucket "media"). Usa Controller porque el valor
// lo setea la subida async, no lo que la persona escribe
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
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkValue, setLinkValue] = useState("");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = typeof field.value === "string" ? field.value : "";

        function handleLinkSubmit(event: FormEvent<HTMLFormElement>) {
          event.preventDefault();
          const trimmed = linkValue.trim();
          if (!/^https?:\/\/.+/i.test(trimmed)) {
            setError("Pega un link completo que empiece con https://");
            return;
          }
          setError(null);
          field.onChange(trimmed);
          setLinkValue("");
          setShowLinkInput(false);
        }

        async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;

          // el accept="image/*" del input es solo sugerencia del navegador, se puede saltar
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
            const compressed = await compressImage(file);
            const supabase = createClient();
            const extension = compressed.name.split(".").pop() || "jpg";
            const path = `${folder}/${crypto.randomUUID()}.${extension}`;

            const { error: uploadError } = await supabase.storage.from("media").upload(path, compressed, {
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

            <div className="flex flex-wrap items-center gap-2">
              <label
                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50 ${uploading ? "pointer-events-none opacity-60" : ""}`}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Upload className="h-4 w-4" aria-hidden="true" />
                )}
                {uploading ? "Comprimiendo y subiendo…" : value ? "Cambiar imagen" : "Subir imagen"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>

              <button
                type="button"
                onClick={() => setShowLinkInput((v) => !v)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
              >
                <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                o pega el link de una imagen
              </button>
            </div>
            <p className="text-xs text-slate-400">Se achica y comprime sola al subirla, para ocupar poco espacio.</p>

            {showLinkInput && (
              <form onSubmit={handleLinkSubmit} className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={linkValue}
                    onChange={(event) => setLinkValue(event.target.value)}
                    placeholder="https://..."
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Usar enlace
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-amber-700">
                  Cuidado: una imagen pegada por link no es tuya, no se comprime, y si la página original la borra o
                  la cambia, aquí también desaparece o cambia sola. Úsalo solo si sabes que tienes permiso de usar
                  esa foto.
                </p>
              </form>
            )}

            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
          </div>
        );
      }}
    />
  );
}
