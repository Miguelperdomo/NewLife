import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { Logo } from "@/components/ui/Logo";
import { getAdminSession } from "@/lib/admin/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO(auth real): cuando exista autenticación, reemplazar esto por
  // `if (!session) redirect("/admin/login")`. Ver lib/admin/auth.ts.
  const session = getAdminSession();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-800">
        <span className="inline-flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
          Área administrativa sin autenticación todavía — no compartas esta URL públicamente.
        </span>
      </div>

      <div className="flex min-h-[calc(100vh-2rem)]">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-950 text-white lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-5">
            <Logo variant="light" />
            <p className="mt-1 text-xs uppercase tracking-widest text-white/40">Panel administrativo</p>
          </div>

          <AdminSidebarNav />

          <div className="space-y-2 border-t border-white/10 px-6 py-4">
            <Link href="/admin/login" className="block text-xs text-white/50 hover:text-white">
              Pantalla de inicio de sesión →
            </Link>
            <Link href="/" className="block text-xs text-white/50 hover:text-white">
              ← Volver al sitio público
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="lg:hidden">
              <Logo variant="dark" />
            </div>
            <h1 className="hidden font-heading text-lg font-bold text-slate-900 lg:block">
              Panel administrativo
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>{session?.name ?? "Invitado"}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                {(session?.name ?? "?").charAt(0)}
              </span>
            </div>
          </header>

          <div className="border-b border-slate-200 bg-white px-4 py-2 sm:px-6 lg:hidden">
            <Link href="/" className="text-xs font-medium text-slate-500 hover:text-brand-600">
              ← Volver al sitio público
            </Link>
          </div>

          <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
