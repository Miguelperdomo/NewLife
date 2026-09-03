import { Baby, Car, Shirt, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { firstTimeContent, firstTimeInfo, type FirstTimeInfoSlug } from "@/data/firstTime";

function FirstTimeIcon({ slug, className }: { slug: FirstTimeInfoSlug; className?: string }) {
  switch (slug) {
    case "dress":
      return <Shirt className={className} aria-hidden="true" />;
    case "kids":
      return <Baby className={className} aria-hidden="true" />;
    case "parking":
      return <Car className={className} aria-hidden="true" />;
    default:
      return <Sparkles className={className} aria-hidden="true" />;
  }
}

export function FirstTimeSection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={firstTimeContent.eyebrow}
          title={firstTimeContent.title}
          description={firstTimeContent.description}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {firstTimeInfo.map((info) => (
            <div
              key={info.slug}
              className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <FirstTimeIcon slug={info.slug} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-heading text-base font-semibold text-slate-900">{info.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{info.description}</p>
              </div>
            </div>
          ))}
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
