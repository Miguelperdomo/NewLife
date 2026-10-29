import { SedesDashboard } from "@/components/admin/SedesDashboard";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Sedes");
}

export default async function AdminSedesPage() {
  await requireSection("campuses");
  return <SedesDashboard />;
}
