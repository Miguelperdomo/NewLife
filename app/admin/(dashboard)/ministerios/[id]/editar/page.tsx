import type { Metadata } from "next";
import { MinistryEditFlow } from "@/components/admin/MinistryEditFlow";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Editar ministerio — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function EditMinistryPage() {
  await requireSection("ministries");
  return <MinistryEditFlow />;
}
