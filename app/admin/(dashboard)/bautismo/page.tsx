import type { Metadata } from "next";
import { BaptismRequestsDashboard } from "@/components/admin/BaptismRequestsDashboard";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Quiero bautizarme — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function AdminBaptismPage() {
  await requireSection("baptism");
  return <BaptismRequestsDashboard />;
}
