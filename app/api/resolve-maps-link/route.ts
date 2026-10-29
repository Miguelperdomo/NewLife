import { NextRequest, NextResponse } from "next/server";

// expande links cortos de Google Maps (maps.app.goo.gl) a la URL larga con coordenadas.
// se hace en el servidor porque el navegador no puede seguir la redirección por CORS.
// whitelist de dominios a propósito: sin auth, así que no puede abrir cualquier URL (SSRF)
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
    // con HEAD algunos links de Google responden 200 sin seguir la redirección real, por eso GET
    const response = await fetch(parsed.toString(), {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NewLifeSiteBot/1.0)" },
    });
    return NextResponse.json({ url: response.url });
  } catch {
    return NextResponse.json({ error: "No se pudo abrir ese link." }, { status: 502 });
  }
}
