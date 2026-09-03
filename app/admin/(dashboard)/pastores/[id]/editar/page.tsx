import type { Metadata } from "next";
import { PastorEditFlow } from "@/components/admin/PastorEditFlow";

export const metadata: Metadata = {
  title: "Editar pastor — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function EditPastorPage() {
  return <PastorEditFlow />;
}
