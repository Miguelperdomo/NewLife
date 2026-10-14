import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";
import { buildOpenGraphMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

const description = "Cómo protegemos tu información en el sitio de New Life.";

export const metadata: Metadata = {
  title: `Política de privacidad — ${siteConfig.name}`,
  description,
  ...buildOpenGraphMetadata({ title: `Política de privacidad — ${siteConfig.name}`, description }),
};

const FALLBACK_TEXT = `En New Life valoramos tu confianza y queremos ser transparentes sobre cómo funciona este sitio web.

Qué información recogemos: si están activados, usamos herramientas de analítica de visitas para saber cuántas personas visitan el sitio y qué páginas ven. Cuando usas un botón de WhatsApp del sitio, te lleva directamente a la app de WhatsApp con un mensaje ya escrito — esa conversación queda en WhatsApp, no en nuestros sistemas.

Qué NO hacemos: no vendemos ni compartimos tu información con terceros para fines publicitarios ajenos a New Life. No pedimos datos bancarios ni de tarjetas a través del sitio — los datos de donación que ves son para que tú hagas una transferencia voluntaria desde tu propia app o banco.

Cómo protegemos la información: el sitio usa conexión segura (HTTPS) y el panel administrativo está protegido con autenticación — solo el equipo autorizado puede editar el contenido.

Tus derechos: puedes escribirnos en cualquier momento si tienes preguntas sobre esta política o quieres saber qué información tenemos sobre ti.`;

export default async function PrivacidadPage() {
  const settings = await getPublicSiteSettings();
  const text = settings?.privacyPolicy || FALLBACK_TEXT;
  const paragraphs = text.split("\n\n").filter(Boolean);

  return (
    <>
      <Breadcrumbs items={[{ label: "Política de privacidad" }]} />

      <section className="py-16 sm:py-24">
        <Container className="mx-auto max-w-3xl">
          <h1 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">Política de privacidad</h1>
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
