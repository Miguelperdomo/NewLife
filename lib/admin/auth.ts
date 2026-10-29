import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { AdminSection } from "@/lib/admin/types";

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  sections: AdminSection[];
}

interface AdminRow {
  name: string | null;
  sections: AdminSection[] | null;
  access_until: string | null;
}

// Sesión real contra Supabase Auth. is_admin() es una función SQL (security
// definer) que confirma que auth.uid() está en la tabla `admins` sin tener
// que exponerla a lectura directa. Null = sin sesión O sesión que no es de
// admin, ambos casos se tratan igual en app/admin/(dashboard)/layout.tsx.
//
// "sections" decide qué puede ver/tocar esta cuenta, "full" es el comodín.
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return null;

  const { data: row } = await supabase
    .from("admins")
    .select("name, sections, access_until")
    .eq("id", user.id)
    .maybeSingle();
  const adminRow = row as AdminRow | null;

  // si ya venció access_until, se trata como "sin permisos" pero sin borrar
  // sections — si le extienden la fecha, recupera los mismos permisos
  const today = new Date().toISOString().slice(0, 10);
  const expired = !!adminRow?.access_until && adminRow.access_until < today;

  return {
    id: user.id,
    name: adminRow?.name || user.email || "Administrador",
    email: user.email ?? "",
    // ojo: es `?? ["full"]`, no `.length > 0 ? ... : ["full"]` — ese segundo
    // caería al respaldo también con sections = [], y antes eso hacía que
    // alguien marcado a propósito como "sin permisos" terminara con acceso total
    sections: expired ? [] : adminRow?.sections ?? ["full"],
  };
}

export function hasSection(session: AdminSession, section: AdminSection): boolean {
  return session.sections.includes("full") || session.sections.includes(section);
}

// Título de cada página, siempre vía generateMetadata (nunca un `export
// const metadata` fijo) porque Next resuelve el <title> antes de que
// notFound() alcance a correr — un título fijo filtraba el nombre real de
// la página en la pestaña aunque no hubiera sesión. Sin sesión, título genérico.
export async function adminMetadata(title: string): Promise<Metadata> {
  const session = await getAdminSession();
  if (!session) {
    return { title: "Página no encontrada", robots: { index: false, follow: false } };
  }
  return { title: `${title} — Panel administrativo New Life`, robots: { index: false, follow: false } };
}
