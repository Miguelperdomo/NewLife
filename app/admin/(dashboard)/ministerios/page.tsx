import type { Metadata } from "next";
import { Suspense } from "react";
import { MinistriesDashboard } from "@/components/admin/MinistriesDashboard";

export const metadata: Metadata = {
  title: "Ministerios — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function AdminMinistriesPage() {
  return (
    <Suspense fallback={null}>
      <MinistriesDashboard />
    </Suspense>
  );
}
