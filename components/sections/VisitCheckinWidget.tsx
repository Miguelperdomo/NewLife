"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { nextSundayISO, submitVisitCheckin } from "@/lib/visitCheckins";
import { visitCheckinFormSchema, type VisitCheckinFormValues } from "@/lib/schemas";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

export function VisitCheckinWidget({ campuses }: { campuses: { slug: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VisitCheckinFormValues>({
    resolver: zodResolver(visitCheckinFormSchema),
    defaultValues: {
      name: "",
      peopleCount: "1",
      campus: campuses[0]?.name ?? "",
      visitDate: nextSundayISO(),
    },
  });

  async function onSubmit(values: VisitCheckinFormValues) {
    setServerError(null);
    try {
      await submitVisitCheckin({ ...values, peopleCount: Number(values.peopleCount) });
      setSent(true);
      reset({ name: "", peopleCount: "1", campus: campuses[0]?.name ?? "", visitDate: nextSundayISO() });
    } catch {
      setServerError("No se pudo enviar. Intenta de nuevo en un momento.");
    }
  }

  function close() {
    setOpen(false);
    setTimeout(() => setSent(false), 300);
  }

  return (
    <>
      <Button type="button" variant="ghost" className="border border-brand-200" onClick={() => setOpen(true)}>
        Avísanos que vienes
      </Button>

      <Modal open={open} onClose={close} title="Avísanos que vienes">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden="true" />
            <p className="font-semibold text-slate-900">¡Listo, te esperamos!</p>
            <p className="text-sm text-slate-500">Nuestro equipo de bienvenida ya sabe que vienes.</p>
            <Button type="button" variant="ghost" className="border border-slate-200" onClick={close}>
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <Gift className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Si nos avisas, te tendremos en cuenta — te vamos a dar un obsequio al finalizar el culto.
            </div>
            <p className="text-sm text-slate-500">
              Cuéntanos quién viene y a cuál sede, para recibirte por tu nombre en la puerta.
            </p>

            <div>
              <label htmlFor="visitName" className="block text-sm font-semibold text-slate-700">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input id="visitName" className={fieldClass} {...register("name")} />
              {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="visitPeopleCount" className="block text-sm font-semibold text-slate-700">
                  ¿Cuántos van? <span className="text-red-500">*</span>
                </label>
                <input id="visitPeopleCount" type="number" min={1} max={50} className={fieldClass} {...register("peopleCount")} />
                {errors.peopleCount && <p className="mt-1 text-xs font-medium text-red-600">{errors.peopleCount.message}</p>}
              </div>
              <div>
                <label htmlFor="visitDate" className="block text-sm font-semibold text-slate-700">
                  ¿Qué día? <span className="text-red-500">*</span>
                </label>
                <input id="visitDate" type="date" className={fieldClass} {...register("visitDate")} />
                {errors.visitDate && <p className="mt-1 text-xs font-medium text-red-600">{errors.visitDate.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="visitCampus" className="block text-sm font-semibold text-slate-700">
                ¿A cuál sede vienes? <span className="text-red-500">*</span>
              </label>
              <select id="visitCampus" className={fieldClass} {...register("campus")}>
                {campuses.map((campus) => (
                  <option key={campus.slug} value={campus.name}>
                    {campus.name}
                  </option>
                ))}
              </select>
              {errors.campus && <p className="mt-1 text-xs font-medium text-red-600">{errors.campus.message}</p>}
              <a
                href="/sedes"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block text-xs font-semibold text-brand-600 hover:underline"
              >
                ¿No sabes qué sede te queda más cerca? Mira el mapa de sedes
              </a>
            </div>

            {serverError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {serverError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" className="border border-slate-200" onClick={close}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Enviando…" : "Enviar"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
