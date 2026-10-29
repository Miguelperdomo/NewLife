import { ActivityLogDashboard } from "@/components/admin/ActivityLogDashboard";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Actividad");
}

export default async function AdminActivityPage() {
  await requireSection("full");
  return <ActivityLogDashboard />;
}
