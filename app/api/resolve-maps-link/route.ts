import { NextRequest, NextResponse } from "next/server";

/**
 * Expande un link corto de Google Maps (ej. maps.app.goo.gl/xxxx, el que
 * comparte la app móvil) a su URL larga real — necesario porque esos links
 * cortos no traen coordenadas visibles y el navegador no puede seguir la
 * redirección de otro dominio por CORS, así que se hace desde el servidor.
 * Lista blanca de dominios a propósito: es un endpoint sin autenticación,
 * así que no debe poder usarse para pedirle al servidor que abra CUALQUIER
 * URL (SSRF) — solo dominios de Google Maps.
 */
const ALLOWED_HOSTNAMES = new Set([
  "maps.app.goo.gl",
  "goo.gl",
  "google.com",
  "www.google.com",
  "maps.google.com",
]);

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Falta el parámetro url." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "URL inválida." }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || !ALLOWED_HOSTNAMES.has(parsed.hostname)) {
    return NextResponse.json({ error: "Solo se permiten links de Google Maps." }, { status: 400 });
  }

  try {
    const response = await fetch(parsed.toString(), { method: "HEAD", redirect: "follow" });
    return NextResponse.json({ url: response.url });
  } catch {
    return NextResponse.json({ error: "No se pudo abrir ese link." }, { status: 502 });
  }
}
