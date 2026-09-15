import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/ui/LogoMark";
import { verses } from "@/data/verses";

export const metadata: Metadata = {
  title: "Iniciar sesión — Panel administrativo New Life",
  robots: { index: false, follow: false },
};

const verse = verses.find((item) => item.slug === "filipenses-4-13") ?? verses[0];

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-950 via-slate-950 to-brand-900 px-4 py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-brand-700/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
      </div>

      <div className="relative flex w-full max-w-md flex-col items-center">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al sitio público
        </Link>

        <div className="w-full rounded-3xl bg-white p-8 shadow-2xl shadow-black/40 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="relative flex h-14 w-14 items-center justify-center">
              <span
                className="absolute h-14 w-14 rounded-2xl bg-accent-400/20 blur-md"
                aria-hidden="true"
              />
              <LogoMark className="relative h-14 w-14 rounded-2xl shadow-lg shadow-brand-900/20" />
            </span>
            <span className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
              New Life
            </span>
            <h1 className="mt-2 font-heading text-2xl font-bold text-slate-900">
              Bienvenido de nuevo
            </h1>
            <p className="mt-1 text-sm text-slate-500">Ingresa al panel administrativo</p>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>

        <p className="mt-8 max-w-xs text-center text-sm italic leading-relaxed text-white/40">
          &ldquo;{verse.text}&rdquo;
          <br />
          <span className="not-italic text-white/30">{verse.reference}</span>
        </p>
      </div>
    </div>
  );
}
