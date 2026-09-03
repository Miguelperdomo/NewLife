import { Code2 } from "lucide-react";

/**
 * Atribución de quién construyó el sitio — informativa, no editable (es la
 * firma del desarrollador, no un dato de la iglesia como el resto de
 * Configuración). Sin datos de contacto a propósito: esta pantalla solo la
 * ve el propio administrador — el contacto real de Providentia Tech vive en
 * el Footer público (components/layout/Footer.tsx), donde sí lo ve cualquiera.
 */
export function CreditsPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-heading text-lg font-bold text-slate-900">Desarrollado por</h3>

      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Code2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-heading text-sm font-bold text-slate-900">Providentia Tech</p>
          <p className="text-sm text-slate-500">Ibagué, Colombia</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Desarrollo de sitios web y paneles administrativos.
      </p>
    </section>
  );
}
