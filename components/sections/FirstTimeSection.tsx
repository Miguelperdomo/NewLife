import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { firstTimeContent, firstTimeInfo } from "@/data/firstTime";
import { getFirstTimeCards } from "@/lib/content";
import { getFirstTimeIcon } from "@/lib/firstTimeIcons";

// Respaldo mientras Configuración no tenga ninguna tarjeta guardada — mismo
// mapeo de íconos que antes tenía FirstTimeSection, para que el Home nunca
// se vea vacío desde el primer despliegue.
const FALLBACK_ICON_BY_SLUG: Record<string, string> = { expect: "sparkles", kids: "baby", parking: "car" };
const FALLBACK_CARDS = firstTimeInfo.map((info) => ({
  icon: FALLBACK_ICON_BY_SLUG[info.slug] ?? "sparkles",
  title: info.title,
  description: info.description,
}));

export async function FirstTimeSection() {
  const cards = await getFirstTimeCards();
  const items = cards.length > 0 ? cards : FALLBACK_CARDS;

  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={firstTimeContent.eyebrow}
          title={firstTimeContent.title}
          description={firstTimeContent.description}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {items.map((item, index) => {
            const Icon = getFirstTimeIcon(item.icon);
            return (
              <div
                key={`${item.title}-${index}`}
                className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm shadow-slate-100"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button href="/sedes" variant="primary">
            {firstTimeContent.ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
