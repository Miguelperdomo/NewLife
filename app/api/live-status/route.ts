import { NextResponse } from "next/server";
import { getLiveStatus } from "@/lib/youtubeLive";

// consultado por el navegador para el aviso "En vivo" del menú — la lógica real vive en lib/youtubeLive.ts
export async function GET() {
  const status = await getLiveStatus();
  return NextResponse.json(status);
}
