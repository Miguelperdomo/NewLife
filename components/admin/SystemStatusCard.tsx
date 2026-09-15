export function SystemStatusCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="font-heading text-lg font-bold text-slate-900">Estado del sistema</h2>
      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-700">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
        Panel funcionando correctamente
      </div>
      <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
        <li>Contenido: almacenado localmente en este navegador (sin base de datos todavía).</li>
        <li>Autenticación: conectada a Supabase Auth.</li>
      </ul>
    </div>
  );
}
