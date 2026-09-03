import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { NotFoundContent } from "@/components/errors/NotFoundContent";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

// Fallback de raíz para rutas que no coinciden con nada (ej. /algo-que-no-existe).
// Renderiza dentro de app/layout.tsx directamente, sin pasar por
// (site)/layout.tsx, así que Navbar/Footer se agregan a mano aquí para que
// se vea igual de "parte del sitio" que el resto de páginas públicas.
export default function RootNotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
