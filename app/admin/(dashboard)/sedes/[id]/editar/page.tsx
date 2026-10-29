import { CampusEditFlow } from "@/components/admin/CampusEditFlow";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Editar sede");
}

export default async function EditCampusPage() {
  await requireSection("campuses");
  return <CampusEditFlow />;
}
