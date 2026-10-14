import { createClient } from "@/lib/supabase/client";
import type { AdminHeroPhoto } from "@/lib/admin/types";

/**
 * Fotos del carrusel de la portada (tabla `hero_photos`) — lista libre sin id
 * propio del lado del formulario, se reemplaza completa al guardar (mismo
 * patrón que first_time_cards/help_options).
 */
interface HeroPhotoRow {
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

export async function loadHeroPhotos(): Promise<AdminHeroPhoto[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hero_photos")
    .select("image_url, alt_text, display_order")
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return (data as HeroPhotoRow[]).map((row) => ({
    imageUrl: row.image_url,
    alt: row.alt_text ?? undefined,
  }));
}

export async function saveHeroPhotos(photos: AdminHeroPhoto[]): Promise<void> {
  const supabase = createClient();
  await supabase.from("hero_photos").delete().not("id", "is", null);

  if (photos.length > 0) {
    await supabase.from("hero_photos").insert(
      photos.map((photo, index) => ({
        image_url: photo.imageUrl,
        alt_text: photo.alt || null,
        display_order: index,
      }))
    );
  }
}
