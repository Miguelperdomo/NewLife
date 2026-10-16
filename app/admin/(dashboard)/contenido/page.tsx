import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentDashboard } from "@/components/admin/ContentDashboard";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Contenido — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  await requireSection("content");
  return (
    <Suspense fallback={null}>
      <ContentDashboard />
    </Suspense>
  );
}
