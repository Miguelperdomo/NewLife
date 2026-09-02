"use client";

import { useCallback, useEffect, useState } from "react";
import { loadStore, saveStore } from "@/lib/admin/storage";
import type { AdminEvent, AdminNews } from "@/lib/admin/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueSlug(base: string, existing: string[]) {
  const cleanBase = base || "contenido";
  if (!existing.includes(cleanBase)) return cleanBase;
  let i = 2;
  while (existing.includes(`${cleanBase}-${i}`)) i++;
  return `${cleanBase}-${i}`;
}

type NewEventInput = Omit<AdminEvent, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };
type NewNewsInput = Omit<AdminNews, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string };

/**
 * Único punto de acceso al contenido del admin (eventos + noticias). Por
 * debajo usa localStorage (lib/admin/storage.ts) — ningún componente toca
 * el storage directamente, así que el día que esto hable con una API real,
 * solo cambia este hook.
 */
interface ContentState {
  events: AdminEvent[];
  news: AdminNews[];
  isReady: boolean;
}

export function useAdminContent() {
  // Se carga en un efecto (no en el estado inicial) a propósito: localStorage
  // no existe durante el render en servidor, así que leerlo antes de montar
  // causaría un mismatch de hidratación. Un solo setState agrupa los 3 valores.
  const [{ events, news, isReady }, setState] = useState<ContentState>({
    events: [],
    news: [],
    isReady: false,
  });

  useEffect(() => {
    const store = loadStore();
    // Excepción deliberada: leer localStorage antes del montaje rompería la
    // hidratación (no existe en el render de servidor). Cargarlo aquí, una
    // sola vez, es el patrón correcto para este caso — no un "you might not
    // need an effect".
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ events: store.events, news: store.news, isReady: true });
  }, []);

  const persist = useCallback((nextEvents: AdminEvent[], nextNews: AdminNews[]) => {
    setState({ events: nextEvents, news: nextNews, isReady: true });
    saveStore({ events: nextEvents, news: nextNews });
  }, []);

  const createEvent = useCallback(
    (input: NewEventInput) => {
      const now = new Date().toISOString();
      const slug = uniqueSlug(
        input.slug || slugify(input.title),
        events.map((event) => event.slug)
      );
      const event: AdminEvent = { ...input, id: crypto.randomUUID(), slug, createdAt: now, updatedAt: now };
      persist([event, ...events], news);
      return event;
    },
    [events, news, persist]
  );

  const updateEvent = useCallback(
    (id: string, input: Partial<AdminEvent>) => {
      const now = new Date().toISOString();
      persist(
        events.map((event) => (event.id === id ? { ...event, ...input, id: event.id, updatedAt: now } : event)),
        news
      );
    },
    [events, news, persist]
  );

  const duplicateEvent = useCallback(
    (id: string) => {
      const original = events.find((event) => event.id === id);
      if (!original) return undefined;
      const now = new Date().toISOString();
      const slug = uniqueSlug(
        `${original.slug}-copia`,
        events.map((event) => event.slug)
      );
      const copy: AdminEvent = {
        ...original,
        id: crypto.randomUUID(),
        slug,
        title: `${original.title} (copia)`,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      };
      persist([copy, ...events], news);
      return copy;
    },
    [events, news, persist]
  );

  const archiveEvent = useCallback((id: string) => updateEvent(id, { status: "archived" }), [updateEvent]);

  const createNews = useCallback(
    (input: NewNewsInput) => {
      const now = new Date().toISOString();
      const slug = uniqueSlug(
        input.slug || slugify(input.title),
        news.map((article) => article.slug)
      );
      const article: AdminNews = { ...input, id: crypto.randomUUID(), slug, createdAt: now, updatedAt: now };
      persist(events, [article, ...news]);
      return article;
    },
    [events, news, persist]
  );

  const updateNews = useCallback(
    (id: string, input: Partial<AdminNews>) => {
      const now = new Date().toISOString();
      persist(
        events,
        news.map((article) =>
          article.id === id ? { ...article, ...input, id: article.id, updatedAt: now } : article
        )
      );
    },
    [events, news, persist]
  );

  const duplicateNews = useCallback(
    (id: string) => {
      const original = news.find((article) => article.id === id);
      if (!original) return undefined;
      const now = new Date().toISOString();
      const slug = uniqueSlug(
        `${original.slug}-copia`,
        news.map((article) => article.slug)
      );
      const copy: AdminNews = {
        ...original,
        id: crypto.randomUUID(),
        slug,
        title: `${original.title} (copia)`,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      };
      persist(events, [copy, ...news]);
      return copy;
    },
    [events, news, persist]
  );

  const archiveNews = useCallback((id: string) => updateNews(id, { status: "archived" }), [updateNews]);

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
