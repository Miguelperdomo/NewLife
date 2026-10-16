import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentCreateFlow } from "@/components/admin/ContentCreateFlow";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Crear contenido — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function NewContentPage() {
  await requireSection("content");
  return (
    <Suspense fallback={null}>
      <ContentCreateFlow />
    </Suspense>
  );
}
