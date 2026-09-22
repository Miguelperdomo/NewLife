import type { Metadata } from "next";
import { AuthPageShell } from "@/components/admin/AuthPageShell";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <AuthPageShell title="Bienvenido de nuevo" subtitle="Ingresa al panel administrativo">
      <LoginForm />
    </AuthPageShell>
  );
}
