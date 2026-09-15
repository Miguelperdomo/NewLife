import { siteConfig } from "@/data/site";

/**
 * Metadata de Open Graph/Twitter reutilizada en todas las páginas públicas,
 * para que compartir un link por WhatsApp/redes muestre una vista previa con
 * imagen y descripción en vez de un link pelado. Si la página no tiene foto
 * propia, se usa el logo de New Life como respaldo — mejor eso que nada.
 *
 * Los campos anidados (`openGraph`, `twitter`) de Next.js NO se combinan con
 * los del layout padre cuando una página los redefine: el objeto completo
 * del hijo reemplaza al del padre. Por eso cada página que llama a esto debe
 * pasar sus propios `title`/`description`/`imageSrc`, sin asumir que algo se
 * hereda del layout raíz.
 */
export function buildOpenGraphMetadata({
  title,
  description,
  imageSrc,
  type = "website",
}: {
  title: string;
  description: string;
  imageSrc?: string;
  type?: "website" | "article";
}) {
  const images = [{ url: imageSrc || siteConfig.logoSrc }];

  return {
    openGraph: {
      title,
      description,
      siteName: siteConfig.name,
      locale: "es_CO",
      type,
      images,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: images.map((image) => image.url),
    },
  };
}
