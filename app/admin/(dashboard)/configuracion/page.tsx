import type { Metadata } from "next";
import { ConfiguracionDashboard } from "@/components/admin/ConfiguracionDashboard";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Configuración — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function AdminConfiguracionPage() {
  await requireSection("settings");
  return <ConfiguracionDashboard />;
}
