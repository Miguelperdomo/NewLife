import { redirect } from "next/navigation";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { AdminUserMenu } from "@/components/admin/AdminUserMenu";
import { GlobalSearch } from "@/components/admin/GlobalSearch";
import { Logo } from "@/components/ui/Logo";
import { getAdminSession } from "@/lib/admin/auth";

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
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="lg:hidden">
              <Logo variant="dark" />
            </div>
            <GlobalSearch />
            <AdminUserMenu name={session.name} />
          </header>

          <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
