export type ContentStatus = "draft" | "published" | "scheduled" | "archived";

export type MinistryAudience =
  | { mode: "all" }
  | { mode: "specific"; ministrySlugs: string[] }
  | { mode: "general" };

interface AdminContentBase {
  id: string;
  slug: string;
  title: string;
  imageSrc?: string;
  status: ContentStatus;
  /** Solo relevante cuando status === "scheduled". */
  publishAt?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminEvent extends AdminContentBase {
  description: string;
  /** "YYYY-MM-DD". */
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  /** Slug de data/campuses.ts. */
  campus?: string;
  location?: string;
  audience: MinistryAudience;
  registrationUrl?: string;
  whatsappNumber?: string;
  capacity?: number;
}

export interface AdminNews extends AdminContentBase {
  summary?: string;
  content: string;
  /** "YYYY-MM-DD". */
  publishedAt: string;
  author?: string;
  category?: string;
}

export type AdminContentType = "event" | "news";

/** Forma "aplanada" común usada por las listas del dashboard (tabla completa, resumen reciente...). */
export interface ContentRow {
  id: string;
  type: AdminContentType;
  title: string;
  imageSrc?: string;
  status: ContentStatus;
  date: string;
  updatedAt: string;
  ministryLabel?: string;
  featured?: boolean;
}
