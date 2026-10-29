import { Suspense } from "react";
import { MinistriesDashboard } from "@/components/admin/MinistriesDashboard";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Ministerios");
}

export default async function AdminMinistriesPage() {
  await requireSection("ministries");
  return (
    <Suspense fallback={null}>
      <MinistriesDashboard />
    </Suspense>
  );
}
