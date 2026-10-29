import { Suspense } from "react";
import { ContentDashboard } from "@/components/admin/ContentDashboard";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Contenido");
}

export default async function AdminContentPage() {
  await requireSection("content");
  return (
    <Suspense fallback={null}>
      <ContentDashboard />
    </Suspense>
  );
}
