"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Droplet,
  HandHeart,
  History,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  Settings,
  UserPlus,
  Users,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminSection } from "@/lib/admin/types";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutGrid;
  exact: boolean;
  section: AdminSection | null;
  /** Color propio de este ítem — para ubicarse más rápido de un vistazo en vez de un menú todo del mismo tono. */
  color: string;
  activeBg: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid, exact: true, section: null, color: "text-slate-300", activeBg: "bg-white/10" },
  { label: "Contenido", href: "/admin/contenido", icon: LayoutDashboard, exact: false, section: "content", color: "text-amber-400", activeBg: "bg-amber-400/10" },
  { label: "Ministerios", href: "/admin/ministerios", icon: Users, exact: false, section: "ministries", color: "text-violet-400", activeBg: "bg-violet-400/10" },
  { label: "Sedes", href: "/admin/sedes", icon: MapPin, exact: false, section: "campuses", color: "text-teal-400", activeBg: "bg-teal-400/10" },
  { label: "Oración", href: "/admin/oracion", icon: HandHeart, exact: false, section: "prayer", color: "text-rose-400", activeBg: "bg-rose-400/10" },
  { label: "Bautismo", href: "/admin/bautismo", icon: Droplet, exact: false, section: "baptism", color: "text-sky-400", activeBg: "bg-sky-400/10" },
  { label: "Primera visita", href: "/admin/visitas", icon: UserPlus, exact: false, section: "visits", color: "text-emerald-400", activeBg: "bg-emerald-400/10" },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings, exact: false, section: "settings", color: "text-slate-300", activeBg: "bg-white/10" },
  { label: "Usuarios", href: "/admin/usuarios", icon: UserCog, exact: false, section: "full", color: "text-indigo-400", activeBg: "bg-indigo-400/10" },
  { label: "Actividad", href: "/admin/actividad", icon: History, exact: false, section: "full", color: "text-orange-400", activeBg: "bg-orange-400/10" },
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
              isCurrent ? cn(item.activeBg, "text-white") : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className={cn("h-4 w-4", item.color)} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
