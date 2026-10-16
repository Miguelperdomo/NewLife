"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  Settings,
  Users,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminSection } from "@/lib/admin/types";

const navItems: { label: string; href: string; icon: typeof LayoutGrid; exact: boolean; section: AdminSection | null }[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid, exact: true, section: null },
  { label: "Contenido", href: "/admin/contenido", icon: LayoutDashboard, exact: false, section: "content" },
  { label: "Ministerios", href: "/admin/ministerios", icon: Users, exact: false, section: "ministries" },
  { label: "Sedes", href: "/admin/sedes", icon: MapPin, exact: false, section: "campuses" },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings, exact: false, section: "settings" },
  { label: "Usuarios", href: "/admin/usuarios", icon: UserCog, exact: false, section: "full" },
  { label: "Actividad", href: "/admin/actividad", icon: History, exact: false, section: "full" },
];

/** `sections` = lo que puede ver esta cuenta ("full" lo destraba todo) — ver lib/admin/auth.ts. */
export function AdminSidebarNav({
  sections,
  onNavigate,
}: {
  sections: AdminSection[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const canSeeAll = sections.includes("full");
  const visibleItems = navItems.filter((item) => item.section === null || canSeeAll || sections.includes(item.section));

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isCurrent = item.exact ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
              isCurrent ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
