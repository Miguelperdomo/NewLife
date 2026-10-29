import { siteConfig } from "@/data/site";

// Metadata de Open Graph/Twitter para que compartir un link muestre imagen +
// descripción en vez de un link pelado. Sin foto propia, cae al logo.
//
// Ojo: Next.js NO combina `openGraph`/`twitter` con los del layout padre —
// el objeto del hijo reemplaza completo al del padre. Por eso cada página
// debe mandar su propio title/description/imageSrc, no asumir herencia.
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
