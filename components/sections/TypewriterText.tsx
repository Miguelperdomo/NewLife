"use client";

import { useEffect, useState } from "react";

const TYPE_SPEED_MS = 45;

// escribe el texto letra por letra al montar, solo decorativo (dura 1-2s).
// arranca con el texto completo (lo que mandó el servidor) y recién en el
// navegador lo borra para "escribirlo" — así un buscador o alguien sin JS
// siempre ve el título completo. respeta "reduce motion"
export function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState(text);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // el primer tick del intervalo ya pasa de "texto completo" a la primera
    // letra, no hace falta vaciarlo antes
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      setTyping(i < text.length);
      if (i >= text.length) clearInterval(timer);
    }, TYPE_SPEED_MS);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <>
      {displayed}
      {typing && (
        <span className="ml-0.5 inline-block h-[0.85em] w-[2px] animate-pulse bg-current align-middle" aria-hidden="true" />
      )}
    </>
  );
}
