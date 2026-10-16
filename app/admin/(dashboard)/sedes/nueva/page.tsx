import type { Metadata } from "next";
import { CampusCreateFlow } from "@/components/admin/CampusCreateFlow";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Crear sede — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function NewCampusPage() {
  await requireSection("campuses");
  return <CampusCreateFlow />;
}
