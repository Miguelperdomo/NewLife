const CACHE_MS = 15 * 60 * 1000;

export interface LiveStatus {
  isLive: boolean;
  videoId?: string;
  checkedAt: number;
}

/** mismo patrón de URL de thumbnail que usa YouTube, no hace falta otra llamada */
export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

let cache: LiveStatus | null = null;

// Consulta si el canal tiene transmisión activa ahora. La usan tanto
// /api/live-status (el navegador, para el aviso del menú) como el Home —
// comparten el mismo caché de 15 min, así que no duplican cuota de YouTube.
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
    // si YouTube falla, no rompe el sitio, solo no muestra "en vivo"
    cache = { isLive: false, checkedAt: Date.now() };
  }

  return cache;
}
