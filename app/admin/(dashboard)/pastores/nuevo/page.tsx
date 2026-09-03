import type { Metadata } from "next";
import { PastorCreateFlow } from "@/components/admin/PastorCreateFlow";

export const metadata: Metadata = {
  title: "Crear pastor — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function NewPastorPage() {
  return <PastorCreateFlow />;
}
