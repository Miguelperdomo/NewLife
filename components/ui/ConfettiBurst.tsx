"use client";

import { useState } from "react";

const COLORS = ["#7c3aed", "#f59e0b", "#10b981"]; // brand-600, accent-500, emerald-500
const PARTICLE_COUNT = 22;

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    key: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.25,
    duration: 0.7 + Math.random() * 0.5,
    color: COLORS[i % COLORS.length],
    rotate: Math.random() * 360,
    drift: (Math.random() - 0.5) * 70,
    round: i % 2 === 0,
  }));
}

/**
 * Ráfaga corta de confeti al confirmar un envío (Oración/Bautismo/Primera
 * visita) — puro CSS, sin librería: cada partícula es un <span> con su propia
 * posición/color/retraso al azar, animado una sola vez por @keyframes
 * confetti-fall (app/globals.css). Se usa junto con <AnimatedCheck />, nunca
 * solo — debe ir dentro de un contenedor con `relative` y `overflow-hidden`.
 *
 * `Math.random()` vive dentro del inicializador de useState (se ejecuta una
 * sola vez, al montar) y no directamente en el render — llamarlo en el
 * cuerpo del render rompe la regla de pureza de componentes de React.
 */
export function ConfettiBurst() {
  const [particles] = useState(createParticles);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.key}
          className={`confetti-particle absolute top-0 h-2 w-2 ${p.round ? "rounded-full" : "rounded-sm"}`}
          style={
            {
              left: `${p.left}%`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--confetti-drift": `${p.drift}px`,
              "--confetti-rotate": `${p.rotate}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
