import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MinistryCard } from "@/components/ministries/MinistryCard";
import { getMinistries } from "@/lib/content";
import { getPublicSiteSettings } from "@/lib/supabase/publicSettings";

export async function MinistriesSection() {
  const [ministries, settings] = await Promise.all([getMinistries(), getPublicSiteSettings()]);

  if (ministries.length === 0) {
    return null;
  }

  const preview = ministries.slice(0, 3);

  return (
    <section className="bg-slate-50 bg-dot-texture py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <SectionHeading
            eyebrow={settings?.ministriesEyebrow || "Ministerios"}
            title={settings?.ministriesTitle || "Encuentra tu lugar"}
            description={
              settings?.ministriesDescription ||
              "Sea cual sea tu edad o etapa de vida, hay un equipo esperándote en New Life."
            }
          />

          {/* Sin sm:grid-cols-2 a propósito: con exactamente 3 tarjetas, 2
              columnas dejaba la tercera sola en una fila a medias — mejor
              pasar directo de 1 columna a 3 en lg:. */}
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {preview.map((ministry, index) => (
              <MinistryCard key={ministry.slug} ministry={ministry} index={index} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button href="/ministerios" variant="ghost">
              Ver todos los ministerios
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
