import { NextResponse } from "next/server";
import { getLiveStatus } from "@/lib/youtubeLive";

/**
 * Lo consulta el navegador (ver lib/useLiveStatus.ts) para el aviso "En
 * vivo" del menú — la lógica real y el caché viven en lib/youtubeLive.ts,
 * compartidos con el Home (que la usa del lado del servidor).
 */
export async function GET() {
  const status = await getLiveStatus();
  return NextResponse.json(status);
}
