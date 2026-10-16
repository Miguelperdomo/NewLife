const CACHE_MS = 15 * 60 * 1000;

export interface LiveStatus {
  isLive: boolean;
  videoId?: string;
  checkedAt: number;
}

let cache: LiveStatus | null = null;

/**
 * Consulta si el canal de YouTube de New Life tiene una transmisión activa
 * ahora mismo. Compartido entre app/api/live-status/route.ts (lo consulta el
 * navegador para el aviso del menú) y el Home (para decidir, al momento de
 * generar la página, si "En vivo" va de primero) — ambos reutilizan el mismo
 * caché en memoria de 15 minutos, así que no duplican cuota de YouTube entre
 * sí.
 */
export async function getLiveStatus(): Promise<LiveStatus> {
  if (cache && Date.now() - cache.checkedAt < CACHE_MS) {
    return cache;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    cache = { isLive: false, checkedAt: Date.now() };
    return cache;
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

  return cache;
}
