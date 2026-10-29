import { LiveDashboard } from "@/components/admin/LiveDashboard";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("En vivo");
}

export default async function AdminLivePage() {
  await requireSection("settings");
  return <LiveDashboard />;
}
