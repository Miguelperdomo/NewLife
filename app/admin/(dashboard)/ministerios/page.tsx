import type { Metadata } from "next";
import { Suspense } from "react";
import { MinistriesDashboard } from "@/components/admin/MinistriesDashboard";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Ministerios — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function AdminMinistriesPage() {
  await requireSection("ministries");
  return (
    <Suspense fallback={null}>
      <MinistriesDashboard />
    </Suspense>
  );
}
