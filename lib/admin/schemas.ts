import { z } from "zod";

const statusEnum = z.enum(["draft", "published", "scheduled", "archived"]);

const audienceSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("all") }),
  z.object({ mode: z.literal("general") }),
  z.object({
    mode: z.literal("specific"),
    ministrySlugs: z.array(z.string()).min(1, "Selecciona al menos un ministerio."),
  }),
]);

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(3, "El título es obligatorio."),
    description: z.string().trim().min(10, "La descripción es obligatoria."),
    imageSrc: z.string().trim().optional(),
    status: statusEnum,
    publishAt: z.string().trim().optional(),
    startDate: z.string().trim().min(1, "La fecha de inicio es obligatoria."),
    endDate: z.string().trim().optional(),
    startTime: z.string().trim().optional(),
    endTime: z.string().trim().optional(),
    campus: z.string().trim().optional(),
    location: z.string().trim().optional(),
    audience: audienceSchema,
    registrationUrl: z.string().trim().optional(),
    whatsappNumber: z.string().trim().optional(),
    // String (no z.coerce) a propósito: mantiene idéntico el tipo que RHF
    // guarda en el formulario y el que espera el resolver — se convierte a
    // número al guardar (ver lib/admin/mappers.ts).
    capacity: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || /^\d+$/.test(value), "Debe ser un número entero positivo."),
    featured: z.boolean().optional(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "La fecha de finalización debe ser igual o posterior a la de inicio.",
    path: ["endDate"],
  })
  .refine((data) => data.status !== "scheduled" || !!data.publishAt, {
    message: "Define la fecha/hora de publicación para un contenido programado.",
    path: ["publishAt"],
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const newsFormSchema = z
  .object({
    title: z.string().trim().min(3, "El título es obligatorio."),
    summary: z.string().trim().optional(),
    content: z.string().trim().min(10, "El contenido es obligatorio."),
    imageSrc: z.string().trim().optional(),
    status: statusEnum,
    publishAt: z.string().trim().optional(),
    publishedAt: z.string().trim().min(1, "La fecha de publicación es obligatoria."),
    author: z.string().trim().optional(),
    category: z.string().trim().optional(),
    featured: z.boolean().optional(),
  })
  .refine((data) => data.status !== "scheduled" || !!data.publishAt, {
    message: "Define la fecha/hora de publicación para un contenido programado.",
    path: ["publishAt"],
  });

export type NewsFormValues = z.infer<typeof newsFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().trim().min(1, "Ingresa tu correo electrónico.").email("Ingresa un correo válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
