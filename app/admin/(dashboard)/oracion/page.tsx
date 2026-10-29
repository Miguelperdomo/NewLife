import { PrayerRequestsDashboard } from "@/components/admin/PrayerRequestsDashboard";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Pedidos de oración");
}

export default async function AdminPrayerPage() {
  await requireSection("prayer");
  return <PrayerRequestsDashboard />;
}
