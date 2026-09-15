import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca el token de sesión de Supabase en cada petición (patrón estándar
 * de @supabase/ssr para Next.js App Router) — sin esto, la sesión podría
 * expirar silenciosamente entre Server Components y Route Handlers.
 * Ver middleware.ts en la raíz, que es quien llama a esto.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // No se descarta el resultado: getUser() es lo que efectivamente dispara
  // el refresco del token cuando hace falta.
  await supabase.auth.getUser();

  return response;
}
