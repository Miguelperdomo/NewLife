import type { Metadata } from "next";
import { MinistryEditFlow } from "@/components/admin/MinistryEditFlow";

export const metadata: Metadata = {
  title: "Editar ministerio — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function EditMinistryPage() {
  return <MinistryEditFlow />;
}
