import type { Metadata } from "next";
import { CampusEditFlow } from "@/components/admin/CampusEditFlow";

export const metadata: Metadata = {
  title: "Editar sede — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function EditCampusPage() {
  return <CampusEditFlow />;
}
