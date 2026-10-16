import type { Metadata } from "next";
import { ContentEditFlow } from "@/components/admin/ContentEditFlow";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Editar contenido — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function EditContentPage() {
  await requireSection("content");
  return <ContentEditFlow />;
}
