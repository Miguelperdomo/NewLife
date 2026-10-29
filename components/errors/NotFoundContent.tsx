import { Button } from "@/components/ui/Button";

/**
 * Contenido visual del 404 — pantalla completa, sin Navbar/Footer (a
 * propósito: ver app/not-found.tsx, el único not-found.tsx del proyecto; se
 * borró app/(site)/not-found.tsx para que notFound() desde cualquier página
 * del sitio también caiga aquí en vez de heredar Navbar/Footer de (site)/layout.tsx).
 */
export function NotFoundContent() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-20 text-center">
      {/* Imagen de fondo por CSS puro (no next/image): el PNG original tiene
          las líneas del logo en blanco casi puro sobre fondo transparente
          (invisibles sobre esta página blanca) — se invierte por CSS a gris
          oscuro y se baja la opacidad para lograr la marca de agua clara.
          Un <div> con background-image se pinta de una vez en el HTML que
          manda el servidor, sin depender de que el navegador cargue y monte
          el componente Image del lado del cliente. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[42%] aspect-[1080/1350] w-[90vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 select-none bg-contain bg-center bg-no-repeat opacity-[0.18] invert"
        style={{ backgroundImage: "url(/img/404-logo-watermark.png)" }}
      />

      <div className="relative flex flex-col items-center">
        <p className="font-heading text-[6rem] font-black leading-none tracking-tight text-slate-950 sm:text-[8rem] md:text-[10rem]">
          404
        </p>

        <h1 className="mt-6 font-heading text-xl font-bold uppercase tracking-[0.25em] text-slate-950 sm:text-2xl">
          Página no encontrada
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500 sm:text-base">
          La página que buscas no existe o fue movida a otra dirección.
        </p>

        <Button
          href="/"
          variant="primary"
          className="mt-8 bg-slate-950 px-8 py-3 text-xs tracking-[0.2em] shadow-none hover:bg-slate-800 hover:shadow-none"
        >
          Volver al inicio
        </Button>
      </div>
    </section>
  );
}
