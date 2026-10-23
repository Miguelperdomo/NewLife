import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldOff } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAdminSession } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Dashboard — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  if (session.sections.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <ShieldOff className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="font-heading text-lg font-bold text-slate-900">Todavía no tienes acceso a nada</p>
        <p className="max-w-sm text-sm text-slate-500">
          Tu cuenta no tiene ningún permiso asignado. Pídele a un administrador que te asigne una sección desde
          Usuarios.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Regresar a la página pública
        </Link>
      </div>
    );
  }

  return <AdminDashboard sections={session.sections} name={session.name} />;
}
