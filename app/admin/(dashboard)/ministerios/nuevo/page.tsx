import { MinistryCreateFlow } from "@/components/admin/MinistryCreateFlow";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Crear ministerio");
}

export default async function NewMinistryPage() {
  await requireSection("ministries");
  return <MinistryCreateFlow />;
}
