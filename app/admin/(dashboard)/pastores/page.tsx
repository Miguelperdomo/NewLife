import type { Metadata } from "next";
import { Suspense } from "react";
import { PastoresDashboard } from "@/components/admin/PastoresDashboard";

export const metadata: Metadata = {
  title: "Pastores — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function AdminPastoresPage() {
  return (
    <Suspense fallback={null}>
      <PastoresDashboard />
    </Suspense>
  );
}
