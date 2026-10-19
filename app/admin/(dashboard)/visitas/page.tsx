import type { Metadata } from "next";
import { VisitCheckinsDashboard } from "@/components/admin/VisitCheckinsDashboard";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Primera visita — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function AdminVisitsPage() {
  await requireSection("visits");
  return <VisitCheckinsDashboard />;
}
