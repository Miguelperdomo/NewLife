import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Dashboard — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
