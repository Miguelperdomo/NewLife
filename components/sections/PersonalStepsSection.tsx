"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, Droplet, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Modal } from "@/components/ui/Modal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { submitBaptismRequest } from "@/lib/baptismRequests";
import { submitPrayerRequest } from "@/lib/prayerRequests";
import {
  baptismRequestFormSchema,
  prayerRequestFormSchema,
  type BaptismRequestFormValues,
  type PrayerRequestFormValues,
} from "@/lib/schemas";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

type StepTab = "prayer" | "baptism";

const TAB_CONTENT: Record<
  StepTab,
  { icon: typeof HandHeart; eyebrow: string; title: string; description: string; cta: string; iconClass: string }
> = {
  prayer: {
    icon: HandHeart,
    eyebrow: "Oración",
    title: "¿Necesitas oración?",
    description: "Cuéntanos qué está pasando — es privado, solo lo lee nuestro equipo pastoral, y oramos por ti.",
    cta: "Enviar un pedido de oración",
    iconClass: "bg-brand-50 text-brand-600",
  },
  baptism: {
    icon: Droplet,
    eyebrow: "Siguiente paso",
    title: "Quiero bautizarme",
    description: "Si ya decidiste dar este paso, cuéntanos — nuestro equipo te va a contactar para acompañarte.",
    cta: "Quiero bautizarme",
    iconClass: "bg-sky-50 text-sky-500",
  },
};

function PrayerModalBody({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrayerRequestFormValues>({
    resolver: zodResolver(prayerRequestFormSchema),
    defaultValues: { name: "", message: "", contact: "" },
  });

  async function onSubmit(values: PrayerRequestFormValues) {
    setServerError(null);
    try {
      await submitPrayerRequest(values);
      setSent(true);
      reset();
    } catch {
      setServerError("No se pudo enviar. Intenta de nuevo en un momento.");
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden="true" />
        <p className="font-semibold text-slate-900">Tu pedido fue enviado</p>
        <p className="text-sm text-slate-500">Nuestro equipo va a orar por ti. Gracias por confiarnos esto.</p>
        <Button type="button" variant="ghost" className="border border-slate-200" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-slate-500">Cuéntanos qué necesitas — es privado, solo lo lee nuestro equipo pastoral.</p>

      <div>
        <label htmlFor="prayerName" className="block text-sm font-semibold text-slate-700">
          Nombre (opcional)
        </label>
        <input
          id="prayerName"
          className={fieldClass}
          placeholder="Puedes dejarlo en blanco si prefieres ser anónimo"
          {...register("name")}
        />
      </div>

      <div>
        <label htmlFor="prayerMessage" className="block text-sm font-semibold text-slate-700">
          Tu pedido <span className="text-red-500">*</span>
        </label>
        <textarea id="prayerMessage" rows={4} className={`${fieldClass} resize-y`} {...register("message")} />
        {errors.message && <p className="mt-1 text-xs font-medium text-red-600">{errors.message.message}</p>}
      </div>

      <div>
        <label htmlFor="prayerContact" className="block text-sm font-semibold text-slate-700">
          WhatsApp o correo (opcional)
        </label>
        <input id="prayerContact" className={fieldClass} placeholder="Solo si quieres que te contactemos" {...register("contact")} />
      </div>

      {serverError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" className="border border-slate-200" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Enviar pedido"}
        </Button>
      </div>
    </form>
  );
}

function BaptismModalBody({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BaptismRequestFormValues>({
    resolver: zodResolver(baptismRequestFormSchema),
    defaultValues: { name: "", phone: "" },
  });

  async function onSubmit(values: BaptismRequestFormValues) {
    setServerError(null);
    try {
      await submitBaptismRequest(values);
      setSent(true);
      reset();
    } catch {
      setServerError("No se pudo enviar. Intenta de nuevo en un momento.");
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden="true" />
        <p className="font-semibold text-slate-900">¡Recibimos tu mensaje!</p>
        <p className="text-sm text-slate-500">Nuestro equipo te va a contactar pronto. Gracias por dar este paso.</p>
        <Button type="button" variant="ghost" className="border border-slate-200" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-slate-500">Déjanos tus datos y alguien de nuestro equipo te va a escribir para contarte cómo sigue.</p>

      <div>
        <label htmlFor="baptismName" className="block text-sm font-semibold text-slate-700">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input id="baptismName" className={fieldClass} {...register("name")} />
        {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="baptismPhone" className="block text-sm font-semibold text-slate-700">
          Teléfono <span className="text-red-500">*</span>
        </label>
        <input id="baptismPhone" type="tel" placeholder="Para contactarte por WhatsApp" className={fieldClass} {...register("phone")} />
        {errors.phone && <p className="mt-1 text-xs font-medium text-red-600">{errors.phone.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" className="border border-slate-200" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Enviar"}
        </Button>
      </div>
    </form>
  );
}

/**
 * Oración y Bautismo compartían el mismo formato de tarjeta y ocupaban el
 * doble de scroll por separado — se unieron en una sola tarjeta con pestañas
 * (como el selector "Iniciar sesión / Registrarse" de un login), más
 * compacta y moderna. Cada pestaña abre su propio modal/formulario, sin
 * mezclar los datos de una con la otra.
 */
export function PersonalStepsSection() {
  const [tab, setTab] = useState<StepTab>("prayer");
  const [prayerOpen, setPrayerOpen] = useState(false);
  const [baptismOpen, setBaptismOpen] = useState(false);

  const content = TAB_CONTENT[tab];
  const Icon = content.icon;

  function closePrayer() {
    setPrayerOpen(false);
  }

  function closeBaptism() {
    setBaptismOpen(false);
  }

  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-slate-100 bg-white p-2 shadow-sm shadow-slate-900/5">
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
              {(["prayer", "baptism"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    "rounded-xl py-2.5 text-sm font-semibold transition-colors",
                    tab === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {TAB_CONTENT[key].eyebrow === "Oración" ? "Oración" : "Bautismo"}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-5 px-6 py-10 text-center sm:px-10">
              <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", content.iconClass)}>
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <SectionHeading
                eyebrow={content.eyebrow}
                title={content.title}
                description={content.description}
                className="max-w-none"
              />
              <Button
                type="button"
                variant="primary"
                onClick={() => (tab === "prayer" ? setPrayerOpen(true) : setBaptismOpen(true))}
              >
                {content.cta}
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </Container>

      <Modal open={prayerOpen} onClose={closePrayer} title="¿Necesitas oración?">
        <PrayerModalBody onClose={closePrayer} />
      </Modal>

      <Modal open={baptismOpen} onClose={closeBaptism} title="Quiero bautizarme">
        <BaptismModalBody onClose={closeBaptism} />
      </Modal>
    </section>
  );
}
