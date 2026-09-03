import type { Metadata } from "next";
import { CampusCreateFlow } from "@/components/admin/CampusCreateFlow";

export const metadata: Metadata = {
  title: "Crear sede — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function NewCampusPage() {
  return <CampusCreateFlow />;
}
