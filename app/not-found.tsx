import type { Metadata } from "next";
import { NotFoundContent } from "@/components/errors/NotFoundContent";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

// Único not-found.tsx del proyecto: captura tanto rutas que no existen
// (ej. /algo-que-no-existe) como notFound() lanzado desde cualquier página
// dentro de (site) (ej. un evento/ministerio/sede con slug borrado). Al vivir
// en la raíz, renderiza dentro de app/layout.tsx directamente — sin
// Navbar/Footer de (site)/layout.tsx — para la pantalla de 404 a pantalla
// completa.
export default function RootNotFound() {
  return <NotFoundContent />;
}
