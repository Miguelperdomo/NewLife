import { NextResponse } from "next/server";

/**
 * Consulta si el canal de YouTube de New Life tiene una transmisión activa
 * ahora mismo. La llave de la API vive solo aquí (variable de entorno de
 * servidor, sin prefijo NEXT_PUBLIC_) — nunca llega al navegador.
 *
 * search.list cuesta 100 unidades de cuota por llamada y la cuota gratuita
 * de YouTube es de 10.000/día — por eso el resultado se guarda en memoria y
 * solo se vuelve a preguntar a YouTube cada CACHE_MS, sin importar cuántos
 * visitantes carguen el sitio mientras tanto.
 */
const CACHE_MS = 15 * 60 * 1000;

interface LiveStatus {
  isLive: boolean;
  videoId?: string;
  checkedAt: number;
}

let cache: LiveStatus | null = null;

export async function GET() {
  if (cache && Date.now() - cache.checkedAt < CACHE_MS) {
    return NextResponse.json(cache);
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    const fallback: LiveStatus = { isLive: false, checkedAt: Date.now() };
    cache = fallback;
    return NextResponse.json(fallback);
  }

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("eventType", "live");
    url.searchParams.set("type", "video");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();
    const liveVideo = data.items?.[0];

    cache = {
      isLive: Boolean(liveVideo),
      videoId: liveVideo?.id?.videoId,
      checkedAt: Date.now(),
    };
  } catch {
    // Si YouTube falla o no responde, no rompe el sitio — simplemente no muestra "en vivo".
    cache = { isLive: false, checkedAt: Date.now() };
  }

  return NextResponse.json(cache);
}
