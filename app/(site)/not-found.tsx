import type { Metadata } from "next";
import { NotFoundContent } from "@/components/errors/NotFoundContent";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

// Captura los notFound() de las páginas dentro de (site) — ej. un evento,
// ministerio, noticia, sede o pastor cuyo slug ya no existe. Al vivir dentro
// del grupo (site), hereda Navbar/Footer de (site)/layout.tsx automáticamente.
export default function SiteNotFound() {
  return <NotFoundContent />;
}
