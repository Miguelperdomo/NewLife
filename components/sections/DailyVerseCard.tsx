import { Cross } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getDailyVerse } from "@/lib/content";

/**
 * Pequeña pausa espiritual dentro del Home: el versículo del día. Contenido
 * en data/verses.ts vía getDailyVerse() — este componente solo presenta.
 */
export function DailyVerseCard() {
  const verse = getDailyVerse();

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <ScrollReveal className="mx-auto max-w-xl">
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-slate-950 to-brand-900 px-8 py-10 text-center shadow-xl shadow-brand-950/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-900/40 sm:px-12 sm:py-12">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
            </div>

            <div className="relative flex flex-col items-center">
              <span className="relative flex h-10 w-10 items-center justify-center">
                <span className="absolute h-10 w-10 rounded-full bg-accent-400/20 blur-md" aria-hidden="true" />
                <Cross className="relative h-5 w-5 text-accent-400" aria-hidden="true" />
              </span>

              <span className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent-400">
                Un momento para ti
              </span>
              <span className="mt-1 text-xs italic text-white/50">Frase del día</span>

              <p className="mt-6 font-heading text-2xl font-semibold leading-snug text-white sm:text-3xl">
                &ldquo;{verse.text}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm">
                <span className="h-px w-6 bg-accent-400/40" aria-hidden="true" />
                <span className="font-semibold text-accent-400">{verse.reference}</span>
                <span className="h-px w-6 bg-accent-400/40" aria-hidden="true" />
              </div>
              <span className="mt-2 text-[11px] uppercase tracking-widest text-white/30">
                {verse.translation}
              </span>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
