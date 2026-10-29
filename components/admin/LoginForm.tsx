"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loginFormSchema, type LoginFormValues } from "@/lib/admin/schemas";
import { createClient } from "@/lib/supabase/client";
import { FormField, inputClass } from "./form/FormField";

// le pide al navegador su cuadro nativo de "guardar contraseña" (Credential Management API, Chrome/Edge)
async function offerToSaveCredential(email: string, password: string) {
  if (typeof window === "undefined" || !("PasswordCredential" in window)) return;
  try {
    const PasswordCredentialCtor = window.PasswordCredential as unknown as new (data: {
      id: string;
      password: string;
      name?: string;
    }) => Credential;
    const credential = new PasswordCredentialCtor({ id: email, password, name: email });
    await navigator.credentials.store?.(credential);
  } catch {
    // si el navegador no lo soporta o lo rechazan, no pasa nada
  }
}

// el error siempre es el mismo genérico, no importa cuál sea la causa real — no dar pistas
export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setAuthError(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error || !data.session) {
      setAuthError("Correo o contraseña incorrectos.");
      return;
    }

    // valida contra la tabla admins (is_admin()) — si no está ahí, se cierra la sesión de una
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) {
      await supabase.auth.signOut();
      setAuthError("Correo o contraseña incorrectos.");
      return;
    }

    await offerToSaveCredential(values.email, values.password);

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <FormField label="Correo electrónico" htmlFor="email" required error={errors.email?.message}>
        <div className="relative mt-1.5">
          <Mail
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="tucorreo@newlife.church"
            className={`${inputClass} mt-0 pl-10`}
            {...register("email")}
          />
        </div>
      </FormField>

      <FormField label="Contraseña" htmlFor="password" required error={errors.password?.message}>
        <div className="relative mt-1.5">
          <Lock
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`${inputClass} mt-0 pl-10 pr-11`}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </FormField>

      <Button type="submit" variant="primary" className="w-full justify-center" disabled={isSubmitting}>
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
      </Button>

      {authError && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {authError}
        </p>
      )}
    </form>
  );
}
