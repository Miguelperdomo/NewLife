"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loginFormSchema, type LoginFormValues } from "@/lib/admin/schemas";
import { FormField, inputClass } from "./form/FormField";

/**
 * Solo visual: no hay backend/API/sesión todavía. `onSubmit` únicamente
 * informa que la autenticación real llegará después — ver lib/admin/auth.ts
 * para el punto donde se conectará.
 */
export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  return (
    <form onSubmit={handleSubmit(() => setSubmitted(true))} noValidate className="space-y-5">
      <FormField label="Correo electrónico" htmlFor="email" required error={errors.email?.message}>
        <div className="relative mt-1.5">
          <Mail
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="email"
            type="email"
            autoComplete="email"
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

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" className="h-4 w-4 rounded" {...register("remember")} />
        Recordarme
      </label>

      <Button type="submit" variant="primary" className="w-full justify-center" disabled={isSubmitting}>
        <LogIn className="h-4 w-4" aria-hidden="true" />
        Iniciar sesión
      </Button>

      {submitted && (
        <p className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-center text-sm text-brand-700">
          La autenticación estará disponible próximamente.
        </p>
      )}
    </form>
  );
}
