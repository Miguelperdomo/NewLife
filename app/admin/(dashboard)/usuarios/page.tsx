import { UsersDashboard } from "@/components/admin/UsersDashboard";
import { adminMetadata } from "@/lib/admin/auth";
import { requireSection } from "@/lib/admin/requireSection";

export async function generateMetadata() {
  return adminMetadata("Usuarios");
}

export default async function AdminUsersPage() {
  const session = await requireSection("full");
  return <UsersDashboard currentUserId={session.id} />;
}
