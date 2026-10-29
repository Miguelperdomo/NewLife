import { BaptismRequestsDashboard } from "@/components/admin/BaptismRequestsDashboard";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Quiero bautizarme");
}

export default async function AdminBaptismPage() {
  await requireSection("baptism");
  return <BaptismRequestsDashboard />;
}
