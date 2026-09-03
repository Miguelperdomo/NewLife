import type { Metadata } from "next";
import { SedesDashboard } from "@/components/admin/SedesDashboard";

export const metadata: Metadata = {
  title: "Sedes — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function AdminSedesPage() {
  return <SedesDashboard />;
}
