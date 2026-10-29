import { ContentEditFlow } from "@/components/admin/ContentEditFlow";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Editar contenido");
}

export default async function EditContentPage() {
  await requireSection("content");
  return <ContentEditFlow />;
}
