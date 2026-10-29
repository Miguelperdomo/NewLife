import { ConfiguracionDashboard } from "@/components/admin/ConfiguracionDashboard";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Configuración");
}

export default async function AdminConfiguracionPage() {
  await requireSection("settings");
  return <ConfiguracionDashboard />;
}
