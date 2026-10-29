import { z } from "zod";

// Formularios del sitio público (sin sesión) — lib/admin/schemas.ts es aparte, para el panel.

// Campo honeypot anti-spam: invisible para una persona, pero los bots que
// rellenan formularios solos sí lo llenan. Si llega con algo, el formulario
// finge que se envió pero no guarda nada. No validamos su contenido, solo si está vacío.
const honeypot = z.string().optional();

export const prayerRequestFormSchema = z.object({
  // opcional, se puede dejar en blanco para ser anónimo
  name: z.string().trim().max(120, "Máximo 120 caracteres.").optional(),
  message: z
    .string()
    .trim()
    .min(5, "Cuéntanos un poco más sobre tu pedido.")
    .max(2000, "Máximo 2000 caracteres."),
  contact: z.string().trim().max(120, "Máximo 120 caracteres.").optional(),
  website: honeypot,
});

export type PrayerRequestFormValues = z.infer<typeof prayerRequestFormSchema>;

export const baptismRequestFormSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre.").max(120, "Máximo 120 caracteres."),
  phone: z.string().trim().min(7, "Ingresa un teléfono válido.").max(30, "Máximo 30 caracteres."),
  website: honeypot,
});

export type BaptismRequestFormValues = z.infer<typeof baptismRequestFormSchema>;

export const visitCheckinFormSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre.").max(120, "Máximo 120 caracteres."),
  phone: z.string().trim().min(7, "Ingresa un teléfono válido.").max(30, "Máximo 30 caracteres."),
  // queda como string (así lo guarda RHF), se convierte a número al enviar
  peopleCount: z
    .string()
    .trim()
    .regex(/^\d+$/, "Ingresa un número válido.")
    .refine((value) => Number(value) >= 1 && Number(value) <= 50, "Debe ser entre 1 y 50 personas."),
  campus: z.string().trim().min(1, "Selecciona una sede."),
  visitDate: z.string().trim().min(1, "Elige una fecha."),
  isPastor: z.boolean(),
  website: honeypot,
});

// sin honeypot, este no guarda nada en BD, solo arma un link de WhatsApp
export const eventAttendanceFormSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre.").max(120, "Máximo 120 caracteres."),
  phone: z.string().trim().max(30, "Máximo 30 caracteres.").optional(),
  campus: z.string().trim().min(1, "Selecciona una sede."),
});

export type EventAttendanceFormValues = z.infer<typeof eventAttendanceFormSchema>;

export type VisitCheckinFormValues = z.infer<typeof visitCheckinFormSchema>;
