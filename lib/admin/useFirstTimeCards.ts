"use client";

import { useCallback, useEffect, useState } from "react";
import { loadFirstTimeCards, saveFirstTimeCards } from "@/lib/admin/firstTimeCards";
import type { AdminFirstTimeCard } from "@/lib/admin/types";

export function useFirstTimeCards() {
  const [cards, setCards] = useState<AdminFirstTimeCard[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadFirstTimeCards().then((loaded) => {
      if (!cancelled) {
        setCards(loaded);
        setIsReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async (next: AdminFirstTimeCard[]) => {
    await saveFirstTimeCards(next);
    setCards(next);
  }, []);

  return { cards, isReady, save };
}
