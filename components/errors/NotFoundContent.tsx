import { Button } from "@/components/ui/Button";

// pantalla completa sin Navbar/Footer a propósito, ver app/not-found.tsx
export function NotFoundContent() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-20 text-center">
      {/* el PNG original es casi blanco sobre transparente (invisible acá), por eso invert + opacity baja */}
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
