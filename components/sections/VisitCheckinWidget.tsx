"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Gift } from "lucide-react";
import { AnimatedCheck } from "@/components/ui/AnimatedCheck";
import { Button } from "@/components/ui/Button";
import { ConfettiBurst } from "@/components/ui/ConfettiBurst";
import { HoneypotField } from "@/components/ui/HoneypotField";
import { Modal } from "@/components/ui/Modal";
import { nextSundayISO, submitVisitCheckin } from "@/lib/visitCheckins";
import { visitCheckinFormSchema, type VisitCheckinFormValues } from "@/lib/schemas";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

const FALLBACK_CITY_LABEL = "Otra ciudad";

// colores por ciudad en el orden que van apareciendo, para distinguirlas de un vistazo
const CITY_BADGE_COLORS = [
  "bg-brand-50 text-brand-700",
  "bg-amber-50 text-amber-700",
  "bg-sky-50 text-sky-700",
  "bg-emerald-50 text-emerald-700",
  "bg-rose-50 text-rose-700",
  "bg-violet-50 text-violet-700",
];

function cityOf(campus: { city?: string }): string {
  return campus.city?.trim() || FALLBACK_CITY_LABEL;
}

// agrupa los campus por ciudad para el <optgroup> del desplegable
function groupByCity<T extends { city?: string }>(campuses: T[]): [string, T[]][] {
  const groups = new Map<string, T[]>();
  for (const campus of campuses) {
    const city = cityOf(campus);
    if (!groups.has(city)) groups.set(city, []);
    groups.get(city)!.push(campus);
  }
  return [...groups.entries()];
}

export function VisitCheckinWidget({ campuses }: { campuses: { slug: string; name: string; city?: string }[] }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VisitCheckinFormValues>({
    resolver: zodResolver(visitCheckinFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      peopleCount: "1",
      campus: campuses[0]?.name ?? "",
      visitDate: nextSundayISO(),
      isPastor: false,
      website: "",
    },
  });

  const campusGroups = groupByCity(campuses);
  const cityColor = new Map(campusGroups.map(([city], index) => [city, CITY_BADGE_COLORS[index % CITY_BADGE_COLORS.length]]));
  const selectedCampusName = watch("campus");
  const selectedCity = cityOf(campuses.find((campus) => campus.name === selectedCampusName) ?? {});

  async function onSubmit(values: VisitCheckinFormValues) {
    setServerError(null);
    const resetValues = {
      name: "",
      phone: "",
      peopleCount: "1",
      campus: campuses[0]?.name ?? "",
      visitDate: nextSundayISO(),
      isPastor: false,
      website: "",
    };
    if (values.website) {
      setSent(true);
      reset(resetValues);
      return;
    }
    try {
      await submitVisitCheckin({ ...values, peopleCount: Number(values.peopleCount) });
      setSent(true);
      reset(resetValues);
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
          <div className="relative flex flex-col items-center gap-3 overflow-hidden py-6 text-center">
            <ConfettiBurst />
            <AnimatedCheck />
            <p className="font-semibold text-slate-900">¡Listo, te esperamos!</p>
            <p className="text-sm text-slate-500">Nuestro equipo de bienvenida ya sabe que vienes.</p>
            <Button type="button" variant="ghost" className="border border-slate-200" onClick={close}>
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <HoneypotField register={register} />
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <Gift className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Si nos avisas, te tendremos en cuenta — te vamos a dar un obsequio al finalizar el servicio.
            </div>
            <p className="text-sm text-slate-500">
              Cuéntanos quién viene y a cuál campus, para recibirte por tu nombre en la puerta.
            </p>

            <div>
              <label htmlFor="visitName" className="block text-sm font-semibold text-slate-700">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input id="visitName" className={fieldClass} {...register("name")} />
              {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name.message}</p>}
              <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded" {...register("isPastor")} />
                Soy pastor
              </label>
            </div>

            <div>
              <label htmlFor="visitPhone" className="block text-sm font-semibold text-slate-700">
                Teléfono / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input id="visitPhone" type="tel" className={fieldClass} {...register("phone")} />
              {errors.phone && <p className="mt-1 text-xs font-medium text-red-600">{errors.phone.message}</p>}
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
              <label htmlFor="visitCampus" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
                ¿A cuál campus vienes? <span className="text-red-500">*</span>
                {selectedCampusName && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cityColor.get(selectedCity) ?? "bg-slate-100 text-slate-600"}`}>
                    {selectedCity}
                  </span>
                )}
              </label>
              <select id="visitCampus" className={fieldClass} {...register("campus")}>
                {campusGroups.map(([city, group]) => (
                  <optgroup key={city} label={city}>
                    {group.map((campus) => (
                      <option key={campus.slug} value={campus.name}>
                        {campus.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.campus && <p className="mt-1 text-xs font-medium text-red-600">{errors.campus.message}</p>}
              <a
                href="/sedes"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block text-xs font-semibold text-brand-600 hover:underline"
              >
                ¿No sabes qué campus te queda más cerca? Mira el mapa de campus
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
