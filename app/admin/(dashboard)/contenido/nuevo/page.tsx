import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentCreateFlow } from "@/components/admin/ContentCreateFlow";

export const metadata: Metadata = {
  title: "Crear contenido — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function NewContentPage() {
  return (
    <Suspense fallback={null}>
      <ContentCreateFlow />
    </Suspense>
  );
}
