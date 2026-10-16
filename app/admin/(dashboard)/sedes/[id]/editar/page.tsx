import type { Metadata } from "next";
import { CampusEditFlow } from "@/components/admin/CampusEditFlow";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Editar sede — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function EditCampusPage() {
  await requireSection("campuses");
  return <CampusEditFlow />;
}
