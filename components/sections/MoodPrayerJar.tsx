"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Mood {
  key: string;
  label: string;
  emoji: string;
  chip: string;
  card: string;
  verse: string;
  reference: string;
}

/**
 * Versículos reales (Reina-Valera 1960), uno por estado de ánimo — ningún
 * texto aquí está inventado. Si se agregan más estados, el versículo debe
 * ser uno de verdad y citado correctamente.
 */
const MOODS: Mood[] = [
  {
    key: "feliz",
    label: "Feliz",
    emoji: "😊",
    chip: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    card: "border-amber-200 bg-amber-50",
    verse: "Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.",
    reference: "Salmos 118:24",
  },
  {
    key: "triste",
    label: "Triste",
    emoji: "😔",
    chip: "bg-sky-100 text-sky-800 hover:bg-sky-200",
    card: "border-sky-200 bg-sky-50",
    verse: "Cercano está Jehová a los quebrantados de corazón, y salva a los contritos de espíritu.",
    reference: "Salmos 34:18",
  },
  {
    key: "enojada",
    label: "Enojada/o",
    emoji: "😠",
    chip: "bg-rose-100 text-rose-800 hover:bg-rose-200",
    card: "border-rose-200 bg-rose-50",
    verse: "Airaos, pero no pequéis; no se ponga el sol sobre vuestro enojo.",
    reference: "Efesios 4:26",
  },
  {
    key: "sinfe",
    label: "Sin fe",
    emoji: "😕",
    chip: "bg-slate-200 text-slate-700 hover:bg-slate-300",
    card: "border-slate-300 bg-slate-100",
    verse: "Creo; ayuda mi incredulidad.",
    reference: "Marcos 9:24",
  },
  {
    key: "confe",
    label: "Con mucha fe",
    emoji: "🙌",
    chip: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    card: "border-emerald-200 bg-emerald-50",
    verse: "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve.",
    reference: "Hebreos 11:1",
  },
  {
    key: "cansada",
    label: "Cansada/o",
    emoji: "😴",
    chip: "bg-violet-100 text-violet-800 hover:bg-violet-200",
    card: "border-violet-200 bg-violet-50",
    verse: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.",
    reference: "Mateo 11:28",
  },
  {
    key: "miedo",
    label: "Con miedo",
    emoji: "😨",
    chip: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    card: "border-orange-200 bg-orange-50",
    verse: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.",
    reference: "Isaías 41:10",
  },
  {
    key: "agradecida",
    label: "Agradecida/o",
    emoji: "🙏",
    chip: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    card: "border-pink-200 bg-pink-50",
    verse: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.",
    reference: "1 Tesalonicenses 5:18",
  },
];

/**
 * "¿Cómo te sientes hoy?" — un detalle pastoral, no un formulario: no guarda
 * nada en la base de datos, es solo una experiencia para la persona en ese
 * momento. Elige un estado de ánimo entre varios (el "frasco") y recibe un
 * versículo real para eso que está sintiendo, con la opción de pasar directo
 * a pedir oración si quiere.
 */
export function MoodPrayerJar({ onRequestPrayer }: { onRequestPrayer: () => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Mood | null>(null);

  function reset() {
    setSelected(null);
    setOpen(false);
  }

  if (selected) {
    return (
      <div className={cn("mt-2 w-full rounded-2xl border p-6 text-center animate-page-fade-in", selected.card)}>
        <span className="text-3xl" aria-hidden="true">
          {selected.emoji}
        </span>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Para ti, hoy</p>
        <p className="mt-2 font-heading text-lg font-semibold italic text-slate-800">“{selected.verse}”</p>
        <p className="mt-1 text-sm font-medium text-slate-500">{selected.reference}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button type="button" variant="primary" onClick={onRequestPrayer}>
            ¿Quieres que oremos por ti?
          </Button>
          <Button type="button" variant="ghost" className="border border-slate-200" onClick={reset}>
            Elegir otro
          </Button>
        </div>
      </div>
    );
  }

  if (open) {
    return (
      <div className="mt-2 w-full rounded-2xl border border-slate-100 bg-slate-50 p-5 animate-page-fade-in">
        <p className="text-center text-sm font-semibold text-slate-700">Elige cómo te sientes hoy</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood.key}
              type="button"
              onClick={() => setSelected(mood)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5",
                mood.chip
              )}
            >
              <span aria-hidden="true">{mood.emoji}</span>
              {mood.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 hover:underline"
    >
      <Sparkles className="h-4 w-4" aria-hidden="true" />
      ¿Cómo te sientes hoy?
    </button>
  );
}
