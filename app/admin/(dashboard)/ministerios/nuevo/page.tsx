import type { Metadata } from "next";
import { MinistryCreateFlow } from "@/components/admin/MinistryCreateFlow";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Crear ministerio — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function NewMinistryPage() {
  await requireSection("ministries");
  return <MinistryCreateFlow />;
}
