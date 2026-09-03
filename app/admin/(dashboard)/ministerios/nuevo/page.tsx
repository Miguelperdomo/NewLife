import type { Metadata } from "next";
import { MinistryCreateFlow } from "@/components/admin/MinistryCreateFlow";

export const metadata: Metadata = {
  title: "Crear ministerio — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function NewMinistryPage() {
  return <MinistryCreateFlow />;
}
