import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession, hasSection } from "@/lib/admin/auth";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { ADMIN_SECTIONS, type AdminSection } from "@/lib/admin/types";

/**
 * Crea una cuenta de administrador de verdad — necesita la llave de servicio
 * (supabase.auth.admin.*), así que corre acá, nunca en el navegador. Antes
 * de tocar nada, confirma con la sesión normal (cookies) que quien pide esto
 * ya es un administrador con permiso "full" — sin esto, cualquiera con la
 * URL podría crear cuentas.
 */
export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session || !hasSection(session, "full")) {
    return NextResponse.json({ error: "No tienes permiso para crear usuarios." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const sections = Array.isArray(body?.sections)
    ? (body.sections.filter((value: unknown): value is AdminSection =>
        ADMIN_SECTIONS.includes(value as AdminSection)
      ) as AdminSection[])
    : [];
  const rawAccessUntil = typeof body?.accessUntil === "string" ? body.accessUntil.trim() : "";
  const accessUntil = /^\d{4}-\d{2}-\d{2}$/.test(rawAccessUntil) ? rawAccessUntil : null;

  if (!name || !email || password.length < 8 || sections.length === 0) {
    return NextResponse.json(
      { error: "Faltan datos: nombre, correo, contraseña (mínimo 8 caracteres) y al menos un permiso." },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message || "No se pudo crear el usuario." }, { status: 400 });
  }

  const { error: insertError } = await supabase.from("admins").insert({
    id: data.user.id,
    name,
    email,
    sections,
    access_until: accessUntil,
  });

  if (insertError) {
    // Si falla guardar la fila de permisos, se deshace la cuenta recién
    // creada — mejor que dejar un usuario de Auth fantasma sin ningún acceso.
    await supabase.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * Último inicio de sesión de cada administrador — vive en Supabase Auth
 * (auth.users.last_sign_in_at), no en la tabla `admins`, así que solo se
 * puede leer con la llave de servicio. Devuelve un mapa id -> fecha para que
 * el panel lo cruce con la lista de usuarios que ya carga por su cuenta.
 */
export async function GET() {
  const session = await getAdminSession();
  if (!session || !hasSection(session, "full")) {
    return NextResponse.json({ error: "No tienes permiso para ver esto." }, { status: 403 });
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 });

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "No se pudo cargar." }, { status: 400 });
  }

  const lastSignIns = Object.fromEntries(data.users.map((user) => [user.id, user.last_sign_in_at ?? null]));
  return NextResponse.json({ lastSignIns });
}
