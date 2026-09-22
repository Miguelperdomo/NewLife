import { verses } from "@/data/verses";
import { getPastorBySlug as getStaticPastorBySlug, getPastors as getStaticPastors } from "@/lib/pastors";
import { createPublicClient } from "@/lib/supabase/publicClient";
import type { Campus, FirstTimeCard, HelpOption, Ministry, Pastor, SocialLink, Verse } from "@/lib/types";

/**
 * Capa de acceso a contenido. Ministerios y Sedes ya leen de Supabase (lo que
 * crea/edita el panel admin); Eventos y Noticias todavía leen de /data —
 * están planeados para una migración aparte. Páginas y componentes solo
 * llaman a estas funciones, nunca a Supabase ni a /data directamente.
 */
interface MinistryRow {
  slug: string;
  name: string;
  short_description: string;
  description: string;
  audience: string | null;
  meeting_schedule: string | null;
  meeting_location: string | null;
  leader: string | null;
  image_url: string | null;
  social: SocialLink[] | null;
}

const MINISTRY_COLUMNS =
  "slug, name, short_description, description, audience, meeting_schedule, meeting_location, leader, image_url, social";

function rowToMinistry(row: MinistryRow): Ministry {
  return {
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    audience: row.audience ?? "",
    schedule: row.meeting_schedule ?? "",
    location: row.meeting_location ?? "",
    leader: row.leader ?? "",
    imageLabel: row.name,
    imageSrc: row.image_url ?? undefined,
    social: row.social && row.social.length > 0 ? row.social : undefined,
  };
}

export async function getMinistries(): Promise<Ministry[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("ministries")
    .select(MINISTRY_COLUMNS)
    .eq("status", "active")
    .eq("show_publicly", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return (data as unknown as MinistryRow[]).map(rowToMinistry);
}

export async function getMinistryBySlug(slug: string): Promise<Ministry | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("ministries")
    .select(MINISTRY_COLUMNS)
    .eq("slug", slug)
    .eq("status", "active")
    .eq("show_publicly", true)
    .maybeSingle();

  if (error || !data) return undefined;
  return rowToMinistry(data as unknown as MinistryRow);
}

interface ScheduleRow {
  day_of_week: number;
  service_time: string;
  title: string;
  description: string | null;
  display_order: number;
}

interface CampusRow {
  slug: string;
  name: string;
  full_name: string;
  address: string;
  map_query: string;
  image_url: string | null;
  is_main: boolean;
  whatsapp_number: string | null;
  pastor: { slug: string } | null;
  campus_gallery_images: { label: string; image_url: string | null }[];
  campus_service_schedules: ScheduleRow[];
}

const CAMPUS_COLUMNS =
  "slug, name, full_name, address, map_query, image_url, is_main, whatsapp_number, pastor:pastors(slug), campus_gallery_images(label, image_url), campus_service_schedules(day_of_week, service_time, title, description, display_order)";

function rowToCampus(row: CampusRow): Campus {
  return {
    slug: row.slug,
    name: row.name,
    fullName: row.full_name,
    address: row.address,
    mapQuery: row.map_query,
    imageLabel: row.full_name,
    imageSrc: row.image_url ?? undefined,
    isMain: row.is_main,
    leadPastorSlug: row.pastor?.slug,
    gallery:
      row.campus_gallery_images && row.campus_gallery_images.length > 0
        ? row.campus_gallery_images.map((image) => ({ label: image.label, src: image.image_url ?? undefined }))
        : undefined,
    whatsappNumber: row.whatsapp_number ?? undefined,
    schedules: (row.campus_service_schedules ?? [])
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((schedule) => ({
        dayOfWeek: schedule.day_of_week,
        // service_time viene de Postgres como "HH:MM:SS" — se recorta a "HH:MM".
        time: schedule.service_time.slice(0, 5),
        title: schedule.title,
        description: schedule.description ?? undefined,
      })),
  };
}

export async function getCampuses(): Promise<Campus[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("campuses")
    .select(CAMPUS_COLUMNS)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return (data as unknown as CampusRow[]).map(rowToCampus);
}

export async function getCampusBySlug(slug: string): Promise<Campus | undefined> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("campuses")
    .select(CAMPUS_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return undefined;
  return rowToCampus(data as unknown as CampusRow);
}

interface PastorProfileRow {
  name: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  whatsapp_number: string | null;
  facebook_url: string | null;
  facebook_enabled: boolean;
  instagram_url: string | null;
  instagram_enabled: boolean;
}

/**
 * New Life solo tiene un pastor a propósito (ver data/pastors.ts) — su slug
 * y su lugar en la pirámide de liderazgo siguen viviendo ahí (fijo, lo usa
 * también CampusForm para el selector de "pastor responsable", un
 * componente "use client" que no puede depender de Supabase). Lo que SÍ es
 * editable desde Configuración (nombre, foto, biografía, redes) vive en la
 * tabla `pastor` — esta función junta ambas fuentes.
 */
async function fetchPastorProfile(): Promise<PastorProfileRow | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("pastor")
    .select("name, role, bio, image_url, whatsapp_number, facebook_url, facebook_enabled, instagram_url, instagram_enabled")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return null;
  return data as PastorProfileRow;
}

function mergePastorProfile(base: Pastor, profile: PastorProfileRow | null): Pastor {
  if (!profile) return base;

  const social: (SocialLink | undefined)[] = [
    profile.facebook_enabled && profile.facebook_url
      ? { platform: "facebook", label: "Facebook", url: profile.facebook_url }
      : undefined,
    profile.instagram_enabled && profile.instagram_url
      ? { platform: "instagram", label: "Instagram", url: profile.instagram_url }
      : undefined,
  ];
  const resolvedSocial = social.filter((link): link is SocialLink => Boolean(link));

  return {
    ...base,
    name: profile.name || base.name,
    role: profile.role || base.role,
    bio: profile.bio || base.bio,
    imageSrc: profile.image_url ?? base.imageSrc,
    whatsappNumber: profile.whatsapp_number ?? base.whatsappNumber,
    social: resolvedSocial.length > 0 ? resolvedSocial : base.social,
  };
}

export async function getPastors(): Promise<Pastor[]> {
  const profile = await fetchPastorProfile();
  return getStaticPastors().map((pastor) => mergePastorProfile(pastor, profile));
}

export async function getPastorBySlug(slug: string): Promise<Pastor | undefined> {
  const staticPastor = getStaticPastorBySlug(slug);
  if (!staticPastor) return undefined;
  const profile = await fetchPastorProfile();
  return mergePastorProfile(staticPastor, profile);
}

interface FirstTimeCardRow {
  icon: string;
  title: string;
  description: string;
  display_order: number;
}

export async function getFirstTimeCards(): Promise<FirstTimeCard[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("first_time_cards")
    .select("icon, title, description, display_order")
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return (data as FirstTimeCardRow[]).map((row) => ({
    icon: row.icon,
    title: row.title,
    description: row.description,
  }));
}

interface HelpOptionRow {
  icon: string;
  title: string;
  description: string;
  display_order: number;
}

export async function getHelpOptions(): Promise<HelpOption[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("help_options")
    .select("icon, title, description, display_order")
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return (data as HelpOptionRow[]).map((row) => ({
    icon: row.icon,
    title: row.title,
    description: row.description,
  }));
}

// Reexportadas desde archivos sin dependencias de servidor, para que el
// código existente que las importaba desde aquí siga funcionando igual —
// ver lib/eventsContent.ts y lib/newsContent.ts para el motivo real (evitar
// que lib/agenda.ts y componentes "use client" arrastren el cliente de
// Supabase de este archivo a su paquete).
export {
  getEvents,
  getEventBySlug,
  getUpcomingEvents,
  getUpcomingEventsByMinistry,
  getRelatedEvents,
} from "@/lib/eventsContent";
export { getNews, getNewsBySlug, getFeaturedNews, getRelatedNews } from "@/lib/newsContent";

/** Elige un versículo distinto cada día del año, de forma estable (mismo resultado todo el día). */
export function getDailyVerse(): Verse {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000);
  return verses[dayOfYear % verses.length];
}
