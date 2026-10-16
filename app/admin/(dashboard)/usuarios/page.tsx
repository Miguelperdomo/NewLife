import type { Metadata } from "next";
import { UsersDashboard } from "@/components/admin/UsersDashboard";
import { requireSection } from "@/lib/admin/requireSection";

export const metadata: Metadata = {
  title: "Usuarios — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  const session = await requireSection("full");
  return <UsersDashboard currentUserId={session.id} />;
}
