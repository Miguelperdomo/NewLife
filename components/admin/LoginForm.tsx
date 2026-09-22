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

/**
 * Le pide al navegador que ofrezca guardar la contraseña justo después de un
 * login exitoso (API estándar de gestión de credenciales — la usan Chrome y
 * Edge; en navegadores sin soporte simplemente no hace nada, sin romper
 * nada). No hay ningún botón de "guardar": es el propio navegador el que
 * muestra su cuadro nativo, como en cualquier otro sitio.
 */
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
    // Silencioso: si el navegador no lo soporta o la persona lo rechaza, no pasa nada grave.
  }
}

/**
 * Login real contra Supabase Auth. El mensaje de error es siempre el mismo
 * genérico ("Correo o contraseña incorrectos") sin importar si falló por
 * correo inexistente, contraseña incorrecta, o el usuario no está en
 * `admins` — no hay que darle pistas a quien intenta adivinar.
 */
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

    // ¿La cuenta que inició sesión es realmente administradora? (tabla
    // `admins`, vía la función is_admin() — ver lib/admin/auth.ts). Si no lo
    // es, se cierra la sesión de inmediato: no debe quedar "medio adentro".
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
