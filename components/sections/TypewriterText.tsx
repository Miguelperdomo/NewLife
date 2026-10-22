"use client";

import { useEffect, useState } from "react";

const TYPE_SPEED_MS = 45;

/**
 * Escribe `text` letra por letra al montar, como si alguien lo tecleara —
 * solo decorativo, dura 1-2 segundos y queda quieto. Arranca mostrando el
 * texto COMPLETO (lo que el servidor ya mandó) y recién en el navegador lo
 * borra y empieza a escribir de nuevo — así un buscador o alguien sin
 * JavaScript siempre ve el título completo, nunca vacío. Respeta "reduce
 * motion": ahí ni se borra, se queda tal cual.
 */
export function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState(text);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Nada de setState síncrono en el cuerpo del efecto: el primer "tick"
    // del intervalo (que corre después, no durante el efecto) ya se encarga
    // de pasar de "texto completo" a "solo la primera letra" — no hace
    // falta un paso aparte que lo vacíe primero.
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
