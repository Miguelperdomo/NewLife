"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid, active: true, exact: true },
  { label: "Contenido", href: "/admin/contenido", icon: LayoutDashboard, active: true, exact: false },
  { label: "Ministerios", href: "#", icon: Users, active: false },
  { label: "Sedes", href: "#", icon: MapPin, active: false },
  { label: "Pastores", href: "#", icon: CalendarDays, active: false },
  { label: "Configuración", href: "#", icon: Settings, active: false },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navItems.map((item) => {
        const Icon = item.icon;

        if (!item.active) {
          return (
            <span
              key={item.label}
              className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-sm text-white/30"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </span>
              <span className="text-[10px] uppercase tracking-wide">Pronto</span>
            </span>
          );
        }

        const isCurrent = item.exact ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
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
