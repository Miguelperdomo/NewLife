import { MinistryEditFlow } from "@/components/admin/MinistryEditFlow";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Editar ministerio");
}

export default async function EditMinistryPage() {
  await requireSection("ministries");
  return <MinistryEditFlow />;
}
