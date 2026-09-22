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
    shortDescription: z
      .string()
      .trim()
      .min(10, "La descripción corta es obligatoria.")
      .max(160, "Máximo 160 caracteres."),
    description: z.string().trim().min(10, "La descripción es obligatoria."),
    category: z.string().trim().optional(),
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

const serviceScheduleFormSchema = z.object({
  dayOfWeek: z.string().trim().min(1, "Selecciona un día."),
  time: z.string().trim().min(1, "La hora es obligatoria."),
  title: z.string().trim().min(2, "El título es obligatorio.").max(80, "Máximo 80 caracteres."),
  description: z.string().trim().optional(),
});

export type ServiceScheduleFormValues = z.infer<typeof serviceScheduleFormSchema>;

export const campusFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio."),
  fullName: z.string().trim().min(2, "El nombre completo es obligatorio."),
  address: z.string().trim().min(5, "La dirección es obligatoria."),
  mapQuery: z.string().trim().min(2, "Agrega un texto de búsqueda para Google Maps."),
  imageSrc: z.string().trim().optional(),
  isMain: z.boolean().optional(),
  leadPastorSlug: z.string().trim().optional(),
  whatsappNumber: z.string().trim().optional(),
  schedules: z.array(serviceScheduleFormSchema),
});

export type CampusFormValues = z.infer<typeof campusFormSchema>;

const ministryStatusEnum = z.enum(["active", "archived"]);

export const ministryFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio.").max(80, "Máximo 80 caracteres."),
  // Editable a mano (a diferencia de eventos/noticias/sedes), por eso vive en
  // el propio schema en vez de generarse solo del lado del hook.
  slug: z
    .string()
    .trim()
    .min(2, "El slug es obligatorio.")
    .max(80, "Máximo 80 caracteres.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Usa solo minúsculas, números y guiones (ej. mi-ministerio)."),
  shortDescription: z
    .string()
    .trim()
    .min(10, "La descripción corta es obligatoria.")
    .max(160, "Máximo 160 caracteres."),
  description: z.string().trim().min(20, "La descripción completa es obligatoria."),
  imageSrc: z.string().trim().optional(),
  leader: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  meetingSchedule: z.string().trim().optional(),
  meetingLocation: z.string().trim().optional(),
  status: ministryStatusEnum,
  // String (no z.coerce) por la misma razón que "capacity" en eventFormSchema.
  displayOrder: z
    .string()
    .trim()
    .min(1, "El orden es obligatorio.")
    .refine((value) => /^\d+$/.test(value), "Debe ser un número entero positivo."),
  showPublicly: z.boolean(),
});

export type MinistryFormValues = z.infer<typeof ministryFormSchema>;

const hexColor = (label: string) =>
  z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, `${label}: usa un color hexadecimal, ej. #7c3aed.`);

export const siteSettingsFormSchema = z.object({
  churchName: z.string().trim().min(2, "El nombre es obligatorio.").max(80, "Máximo 80 caracteres."),
  description: z.string().trim().optional(),
  logoUrl: z.string().trim().optional(),
  faviconUrl: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  whatsappNumber: z.string().trim().min(1, "El WhatsApp principal es obligatorio."),
  email: z.string().trim().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  generalSchedule: z.string().trim().optional(),

  heroTagline: z.string().trim().max(120, "Máximo 120 caracteres.").optional(),

  primaryColor: hexColor("Color principal"),
  accentColor: hexColor("Color de acento"),
  coverImageUrl: z.string().trim().optional(),

  facebookUrl: z.string().trim().optional(),
  facebookEnabled: z.boolean(),
  instagramUrl: z.string().trim().optional(),
  instagramEnabled: z.boolean(),
  youtubeUrl: z.string().trim().optional(),
  youtubeEnabled: z.boolean(),
  tiktokUrl: z.string().trim().optional(),
  tiktokEnabled: z.boolean(),
  whatsappSocialUrl: z.string().trim().optional(),
  whatsappSocialEnabled: z.boolean(),

  showMinistries: z.boolean(),
  showLive: z.boolean(),
  showEvents: z.boolean(),
  showNews: z.boolean(),
  showAgenda: z.boolean(),
  showCampuses: z.boolean(),
  showHelp: z.boolean(),

  whatsappDefaultMessage: z.string().trim().min(3, "Escribe un mensaje predeterminado."),
  supportPhone: z.string().trim().optional(),
  contactEmail: z.string().trim().optional(),

  seoTitle: z.string().trim().max(70, "Máximo 70 caracteres.").optional(),
  seoDescription: z.string().trim().max(160, "Máximo 160 caracteres.").optional(),
  seoImageUrl: z.string().trim().optional(),

  aboutImageUrl: z.string().trim().optional(),
  aboutQuienesSomos: z.string().trim().optional(),
  aboutMision: z.string().trim().optional(),
  aboutVision: z.string().trim().optional(),
  aboutValores: z.string().trim().optional(),

  helpTitle: z.string().trim().optional(),
  helpDescription: z.string().trim().optional(),
  helpCtaLabel: z.string().trim().optional(),
  helpOptionsTitle: z.string().trim().optional(),

  donationsEnabled: z.boolean(),
  bankName: z.string().trim().optional(),
  bankAccountType: z.string().trim().optional(),
  bankAccountNumber: z.string().trim().optional(),
  bankAccountHolder: z.string().trim().optional(),
  nequiNumber: z.string().trim().optional(),
  daviplataNumber: z.string().trim().optional(),

  maintenanceMode: z.boolean(),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;

/**
 * Valida un archivo de "Importar configuración" (Sistema > Zona peligrosa)
 * antes de guardarlo — a diferencia de siteSettingsFormSchema (campos
 * opcionales como string vacío ""), este espera la forma real de
 * AdminSiteSettings (campos opcionales como undefined). Sin esto, un JSON
 * dañado o manipulado a mano se escribiría directo en Supabase sin revisar
 * nada.
 */
export const adminSiteSettingsSchema = z.object({
  churchName: z.string().trim().min(1),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  phone: z.string().optional(),
  whatsappNumber: z.string().trim().min(1),
  email: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  generalSchedule: z.string().optional(),

  heroTagline: z.string().optional(),

  primaryColor: hexColor("Color principal"),
  accentColor: hexColor("Color de acento"),
  coverImageUrl: z.string().optional(),

  facebookUrl: z.string().optional(),
  facebookEnabled: z.boolean(),
  instagramUrl: z.string().optional(),
  instagramEnabled: z.boolean(),
  youtubeUrl: z.string().optional(),
  youtubeEnabled: z.boolean(),
  tiktokUrl: z.string().optional(),
  tiktokEnabled: z.boolean(),
  whatsappSocialUrl: z.string().optional(),
  whatsappSocialEnabled: z.boolean(),

  showMinistries: z.boolean(),
  showLive: z.boolean(),
  showEvents: z.boolean(),
  showNews: z.boolean(),
  showAgenda: z.boolean(),
  showCampuses: z.boolean(),
  showHelp: z.boolean(),

  whatsappDefaultMessage: z.string().trim().min(1),
  supportPhone: z.string().optional(),
  contactEmail: z.string().optional(),

  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImageUrl: z.string().optional(),

  aboutImageUrl: z.string().optional(),
  aboutQuienesSomos: z.string().optional(),
  aboutMision: z.string().optional(),
  aboutVision: z.string().optional(),
  aboutValores: z.string().optional(),

  helpTitle: z.string().optional(),
  helpDescription: z.string().optional(),
  helpCtaLabel: z.string().optional(),
  helpOptionsTitle: z.string().optional(),

  donationsEnabled: z.boolean(),
  bankName: z.string().optional(),
  bankAccountType: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountHolder: z.string().optional(),
  nequiNumber: z.string().optional(),
  daviplataNumber: z.string().optional(),

  maintenanceMode: z.boolean(),
  updatedAt: z.string(),
});

export const firstTimeCardFormSchema = z.object({
  icon: z.string().trim().min(1, "Selecciona un ícono."),
  title: z.string().trim().min(2, "El título es obligatorio.").max(60, "Máximo 60 caracteres."),
  description: z.string().trim().min(5, "La descripción es obligatoria."),
});

export const firstTimeCardsFormSchema = z.object({
  cards: z.array(firstTimeCardFormSchema),
});

export type FirstTimeCardsFormValues = z.infer<typeof firstTimeCardsFormSchema>;

export const helpOptionFormSchema = z.object({
  icon: z.string().trim().min(1, "Selecciona un ícono."),
  title: z.string().trim().min(2, "El título es obligatorio.").max(60, "Máximo 60 caracteres."),
  description: z.string().trim().min(5, "La descripción es obligatoria."),
});

export const helpOptionsFormSchema = z.object({
  options: z.array(helpOptionFormSchema),
});

export type HelpOptionsFormValues = z.infer<typeof helpOptionsFormSchema>;

export const pastorProfileFormSchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio."),
  role: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  imageSrc: z.string().trim().optional(),
  whatsappNumber: z.string().trim().optional(),
  facebookUrl: z.string().trim().optional(),
  facebookEnabled: z.boolean(),
  instagramUrl: z.string().trim().optional(),
  instagramEnabled: z.boolean(),
});

export type PastorProfileFormValues = z.infer<typeof pastorProfileFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().trim().min(1, "Ingresa tu correo electrónico.").email("Ingresa un correo válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
