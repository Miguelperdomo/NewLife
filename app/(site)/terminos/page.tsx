import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";
import { buildOpenGraphMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

const description = "Reglas de uso del sitio de New Life.";

export const metadata: Metadata = {
  title: `Términos y condiciones — ${siteConfig.name}`,
  description,
  ...buildOpenGraphMetadata({ title: `Términos y condiciones — ${siteConfig.name}`, description }),
};

const FALLBACK_TEXT = `Al usar el sitio web de New Life, aceptas estos términos.

Sobre el contenido: todo el contenido de este sitio (textos, fotos, logo, videos) pertenece a New Life o se usa con autorización. Puedes compartir enlaces al sitio, pero no copiar o reutilizar el contenido sin permiso.

Donaciones: los datos de donación (cuenta bancaria, Nequi, Daviplata) que aparecen en el sitio son para que hagas un aporte voluntario directamente desde tu banco o billetera digital. New Life no procesa pagos a través del sitio — la transacción ocurre completamente fuera de nuestra plataforma. Verifica siempre los datos antes de transferir. Las donaciones son voluntarias y no reembolsables.

Enlaces externos: el sitio incluye enlaces a redes sociales, YouTube y WhatsApp. Una vez sales de nuestro sitio hacia esas plataformas, aplican los términos y políticas de cada una.

Cambios: podemos actualizar estos términos cuando lo necesitemos.

Contacto: si tienes preguntas sobre estos términos, escríbenos.`;

export default async function TerminosPage() {
  const settings = await getPublicSiteSettings();
  const text = settings?.termsOfService || FALLBACK_TEXT;
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <>
      <Breadcrumbs items={[{ label: "Términos y condiciones" }]} />

      <section className="py-16 sm:py-24">
        <Container className="mx-auto max-w-3xl">
          <h1 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">Términos y condiciones</h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
