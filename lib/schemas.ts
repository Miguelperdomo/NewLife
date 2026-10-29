import { z } from "zod";

/**
 * Schemas de formularios del sitio PÚBLICO (sin sesión) — separados de
 * lib/admin/schemas.ts, que es solo para formularios del panel administrativo.
 */
// Campo "honeypot" anti-spam: invisible para una persona real, pero los bots
// que rellenan formularios automáticamente sí lo llenan. Si llega con algo
// escrito, el formulario finge que se envió pero no manda nada a la base de
// datos (ver cada *ModalBody / VisitCheckinWidget). No se valida con zod a
// propósito — da igual qué tenga, solo importa si está vacío o no.
const honeypot = z.string().optional();

export const prayerRequestFormSchema = z.object({
  // Opcional a propósito: la persona puede dejarlo en blanco para ser anónima.
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
  // Se mantiene como string, igual que lo guarda RHF desde un <input> — se
  // convierte a número solo al enviar (ver VisitCheckinWidget), no aquí.
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

// Sin honeypot a propósito: este formulario no guarda nada en la base de
// datos, solo arma un link de WhatsApp — no hay nada que un bot pueda ensuciar.
export const eventAttendanceFormSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre.").max(120, "Máximo 120 caracteres."),
  phone: z.string().trim().max(30, "Máximo 30 caracteres.").optional(),
  campus: z.string().trim().min(1, "Selecciona una sede."),
});

export type EventAttendanceFormValues = z.infer<typeof eventAttendanceFormSchema>;

export type VisitCheckinFormValues = z.infer<typeof visitCheckinFormSchema>;
