"use client";

import { useEffect, useState } from "react";

export interface LiveStatus {
  isLive: boolean;
  videoId?: string;
}

const POLL_MS = 2 * 60 * 1000;

/**
 * Consulta /api/live-status (propio del sitio, no directamente YouTube) al
 * montar y cada POLL_MS. El endpoint ya cachea la llamada real a YouTube por
 * su lado, así que este intervalo solo afecta qué tan rápido se entera el
 * navegador de un cambio — no genera consultas extra a la API de YouTube.
 */
export function useLiveStatus(): LiveStatus {
  const [status, setStatus] = useState<LiveStatus>({ isLive: false });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const response = await fetch("/api/live-status");
        const data = (await response.json()) as LiveStatus;
        if (!cancelled) setStatus(data);
      } catch {
        // Silencioso: si falla, se queda con el último estado conocido (por defecto, no en vivo).
      }
    }

    check();
    const interval = setInterval(check, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}
