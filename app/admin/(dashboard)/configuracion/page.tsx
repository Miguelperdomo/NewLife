import type { Metadata } from "next";
import { ConfiguracionDashboard } from "@/components/admin/ConfiguracionDashboard";

export const metadata: Metadata = {
  title: "Configuración — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function AdminConfiguracionPage() {
  return <ConfiguracionDashboard />;
}
