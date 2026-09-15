import { redirect } from "next/navigation";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { Logo } from "@/components/ui/Logo";
import { getAdminSession } from "@/lib/admin/auth";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-950 text-white lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-5">
            <Logo variant="light" />
            <p className="mt-1 text-xs uppercase tracking-widest text-white/40">Panel administrativo</p>
          </div>

          <AdminSidebarNav />

          <div className="space-y-2 border-t border-white/10 px-6 py-4">
            <LogoutButton />
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
              <span>{session.name}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                {session.name.charAt(0).toUpperCase()}
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
