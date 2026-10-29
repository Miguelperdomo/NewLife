import { VisitCheckinsDashboard } from "@/components/admin/VisitCheckinsDashboard";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Primera visita");
}

export default async function AdminVisitsPage() {
  await requireSection("visits");
  return <VisitCheckinsDashboard />;
}
