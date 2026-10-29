"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { eventAttendanceFormSchema, type EventAttendanceFormValues } from "@/lib/schemas";
import { buildWhatsAppLink, eventAttendanceMessage } from "@/lib/whatsapp";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500";

// botón "Quiero asistir" del hero de evento destacado. Pregunta nombre y sede
// (como VisitCheckinWidget) y arma el WhatsApp con eso — no guarda nada en la BD,
// el mensaje de WhatsApp ES el registro
export function EventAttendanceForm({
  eventName,
  defaultCampus,
  campuses,
  whatsappNumber,
  label = "Quiero asistir",
}: {
  eventName: string;
  defaultCampus?: string;
  campuses: { slug: string; name: string }[];
  whatsappNumber: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventAttendanceFormValues>({
    resolver: zodResolver(eventAttendanceFormSchema),
    defaultValues: { name: "", phone: "", campus: defaultCampus ?? campuses[0]?.name ?? "" },
  });

  // si el evento ya tiene sede fija no hay que preguntarla, solo se muestra como texto
  const hasFixedCampus = Boolean(defaultCampus);

  function onSubmit(values: EventAttendanceFormValues) {
    const message = eventAttendanceMessage(eventName, values.name, values.campus);
    window.open(buildWhatsAppLink(whatsappNumber, message), "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <>
      <Button type="button" variant="secondary" size="lg" onClick={() => setOpen(true)}>
        {label}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title={label}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-slate-500">
            Cuéntanos quién eres para &ldquo;{eventName}&rdquo; — te escribimos por WhatsApp con los detalles.
          </p>

          <div>
            <label htmlFor="attendanceName" className="block text-sm font-semibold text-slate-700">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input id="attendanceName" className={fieldClass} {...register("name")} />
            {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="attendancePhone" className="block text-sm font-semibold text-slate-700">
              Teléfono / WhatsApp (opcional)
            </label>
            <input id="attendancePhone" type="tel" className={fieldClass} {...register("phone")} />
          </div>

          {hasFixedCampus ? (
            <div>
              <p className="block text-sm font-semibold text-slate-700">Sede</p>
              <p className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600">
                {defaultCampus}
              </p>
            </div>
          ) : (
            <div>
              <label htmlFor="attendanceCampus" className="block text-sm font-semibold text-slate-700">
                ¿A cuál sede vas? <span className="text-red-500">*</span>
              </label>
              <select id="attendanceCampus" className={fieldClass} {...register("campus")}>
                {campuses.map((campus) => (
                  <option key={campus.slug} value={campus.name}>
                    {campus.name}
                  </option>
                ))}
              </select>
              {errors.campus && <p className="mt-1 text-xs font-medium text-red-600">{errors.campus.message}</p>}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" className="border border-slate-200" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Continuar por WhatsApp
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
