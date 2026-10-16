import type { Metadata } from "next";
import { ActivityLogDashboard } from "@/components/admin/ActivityLogDashboard";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Actividad — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function AdminActivityPage() {
  await requireSection("full");
  return <ActivityLogDashboard />;
}
