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
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-slate-950 to-brand-900 px-8 py-12 text-center shadow-xl shadow-brand-950/30 ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-900/40 sm:px-14 sm:py-16">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/50 to-transparent" />
              <span
                className="absolute -top-6 left-1/2 -translate-x-1/2 select-none font-heading text-[8rem] leading-none text-white/[0.04]"
                aria-hidden="true"
              >
                &ldquo;
              </span>
            </div>

            <div className="relative flex flex-col items-center">
              <span className="relative flex h-12 w-12 items-center justify-center">
                <span
                  className="absolute h-12 w-12 animate-pulse rounded-full bg-accent-400/25 blur-md motion-reduce:animate-none"
                  aria-hidden="true"
                />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-accent-400/30 bg-white/5">
                  <Cross className="h-4 w-4 text-accent-400" aria-hidden="true" />
                </span>
              </span>

              <h2 className="mt-5 font-heading text-lg font-bold tracking-tight text-white sm:text-xl">
                Cápsula de Fe
              </h2>
              <span className="mt-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-accent-400">
                Un momento para ti
              </span>

              <p className="mt-7 font-heading text-2xl font-semibold leading-snug text-white sm:text-3xl">
                &ldquo;{verse.text}&rdquo;
              </p>

              <div className="mt-7 flex items-center gap-2 text-sm">
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
