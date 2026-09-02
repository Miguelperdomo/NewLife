import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentDashboard } from "@/components/admin/ContentDashboard";

export const metadata: Metadata = {
  title: "Contenido — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function AdminContentPage() {
  return (
    <Suspense fallback={null}>
      <ContentDashboard />
    </Suspense>
  );
}
