"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createEvent as createEventRequest,
  duplicateEvent as duplicateEventRequest,
  loadEvents,
  setEventStatus,
  updateEvent as updateEventRequest,
} from "@/lib/admin/events";
import {
  createNews as createNewsRequest,
  duplicateNews as duplicateNewsRequest,
  loadNews,
  setNewsStatus,
  updateNews as updateNewsRequest,
} from "@/lib/admin/news";
import type { AdminEvent, AdminNews } from "@/lib/admin/types";

type NewEventInput = Omit<AdminEvent, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };
type NewNewsInput = Omit<AdminNews, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };

/**
 * Único punto de acceso al contenido del admin (eventos + noticias) — ambos
 * ya viven en Supabase (lib/admin/events.ts, lib/admin/news.ts). Mismo
 * patrón que los demás módulos: cada mutación vuelve a pedir su lista
 * completa.
 */
interface ContentState {
  events: AdminEvent[];
  news: AdminNews[];
  isReady: boolean;
}

export function useAdminContent() {
  const [{ events, news, isReady }, setState] = useState<ContentState>({
    events: [],
    news: [],
    isReady: false,
  });

  const refreshEvents = useCallback(async () => {
    const loaded = await loadEvents();
    setState((prev) => ({ ...prev, events: loaded, isReady: true }));
    return loaded;
  }, []);

  const refreshNews = useCallback(async () => {
    const loaded = await loadNews();
    setState((prev) => ({ ...prev, news: loaded, isReady: true }));
    return loaded;
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadEvents(), loadNews()]).then(([loadedEvents, loadedNews]) => {
      if (!cancelled) setState({ events: loadedEvents, news: loadedNews, isReady: true });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const createEvent = useCallback(
    async (input: NewEventInput) => {
      const created = await createEventRequest(
        input,
        events.map((event) => event.slug)
      );
      await refreshEvents();
      return created;
    },
    [events, refreshEvents]
  );

  const updateEvent = useCallback(
    async (id: string, input: Partial<AdminEvent>) => {
      const updated = await updateEventRequest(id, input);
      await refreshEvents();
      return updated;
    },
    [refreshEvents]
  );

  const duplicateEvent = useCallback(
    async (id: string) => {
      const original = events.find((event) => event.id === id);
      if (!original) return undefined;
      const created = await duplicateEventRequest(
        original,
        events.map((event) => event.slug)
      );
      await refreshEvents();
      return created;
    },
    [events, refreshEvents]
  );

  const archiveEvent = useCallback(
    async (id: string) => {
      await setEventStatus(id, "archived");
      await refreshEvents();
    },
    [refreshEvents]
  );

  const createNews = useCallback(
    async (input: NewNewsInput) => {
      const created = await createNewsRequest(
        input,
        news.map((article) => article.slug)
      );
      await refreshNews();
      return created;
    },
    [news, refreshNews]
  );

  const updateNews = useCallback(
    async (id: string, input: Partial<AdminNews>) => {
      const updated = await updateNewsRequest(id, input);
      await refreshNews();
      return updated;
    },
    [refreshNews]
  );

  const duplicateNews = useCallback(
    async (id: string) => {
      const original = news.find((article) => article.id === id);
      if (!original) return undefined;
      const created = await duplicateNewsRequest(
        original,
        news.map((article) => article.slug)
      );
      await refreshNews();
      return created;
    },
    [news, refreshNews]
  );

  const archiveNews = useCallback(
    async (id: string) => {
      await setNewsStatus(id, "archived");
      await refreshNews();
    },
    [refreshNews]
  );

  return {
    events,
    news,
    isReady,
    createEvent,
    updateEvent,
    duplicateEvent,
    archiveEvent,
    createNews,
    updateNews,
    duplicateNews,
    archiveNews,
  };
}
