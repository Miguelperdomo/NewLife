import type { Metadata } from "next";
import { PrayerRequestsDashboard } from "@/components/admin/PrayerRequestsDashboard";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Pedidos de oración — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function AdminPrayerPage() {
  await requireSection("prayer");
  return <PrayerRequestsDashboard />;
}
