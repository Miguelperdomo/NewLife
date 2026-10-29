import { Suspense } from "react";
import { ContentCreateFlow } from "@/components/admin/ContentCreateFlow";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Crear contenido");
}

export default async function NewContentPage() {
  await requireSection("content");
  return (
    <Suspense fallback={null}>
      <ContentCreateFlow />
    </Suspense>
  );
}
