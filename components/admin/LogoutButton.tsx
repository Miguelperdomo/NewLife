"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white disabled:opacity-50"
    >
      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
      {loading ? "Cerrando sesión…" : "Cerrar sesión"}
    </button>
  );
}
