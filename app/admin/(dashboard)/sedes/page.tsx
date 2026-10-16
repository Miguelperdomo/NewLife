import type { Metadata } from "next";
import { SedesDashboard } from "@/components/admin/SedesDashboard";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Sedes — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function AdminSedesPage() {
  await requireSection("campuses");
  return <SedesDashboard />;
}
