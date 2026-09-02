import type { Metadata } from "next";
import { ContentEditFlow } from "@/components/admin/ContentEditFlow";

export const metadata: Metadata = {
  title: "Editar contenido — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function EditContentPage() {
  return <ContentEditFlow />;
}
