import { redirect } from "next/navigation";
import { getAdminSession, hasSection, type AdminSession } from "@/lib/admin/auth";
import type { AdminSection } from "@/lib/admin/types";

/** Exige sesión + el permiso indicado (o "full"), si no manda al Dashboard. Usar al inicio de cada page.tsx protegida. */
export async function requireSection(section: AdminSection): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session || !hasSection(session, section)) redirect("/admin");
  return session;
}
