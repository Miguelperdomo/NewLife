import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Contenido visual del 404 — compartido por app/not-found.tsx (raíz, para
 * rutas totalmente inexistentes) y app/(site)/not-found.tsx (para un
 * slug que no existe dentro del sitio, ej. /eventos/algo-borrado). El
 * segundo hereda Navbar/Footer automáticamente por vivir dentro del grupo
 * (site); el de la raíz los agrega a mano — ver ambos archivos.
 */
export function NotFoundContent() {
  return (
    <section className="flex min-h-[65vh] items-center py-20 sm:py-28">
      <Container className="flex flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Compass className="h-10 w-10" aria-hidden="true" />
        </span>

        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-brand-600">Error 404</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
          Esta página no existe
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
          Puede que el enlace esté mal escrito o que la página ya no esté disponible. Pero siempre hay un
          lugar para ti en New Life.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" variant="primary">
            <Home className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </Button>
          <Button href="/eventos" variant="ghost">
            Eventos
          </Button>
          <Button href="/ministerios" variant="ghost">
            Ministerios
          </Button>
          <Button href="/sedes" variant="ghost">
            Sedes
          </Button>
        </div>
      </Container>
    </section>
  );
}
