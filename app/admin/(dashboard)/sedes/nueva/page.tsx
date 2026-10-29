import { CampusCreateFlow } from "@/components/admin/CampusCreateFlow";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Crear sede");
}

export default async function NewCampusPage() {
  await requireSection("campuses");
  return <CampusCreateFlow />;
}
