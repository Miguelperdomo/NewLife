import type { Pastor } from "@/lib/types";
import { PastorCard } from "./PastorCard";

/**
 * Organiza a los pastores/líderes por `tier` (1 = cabeza, 2 = siguiente
 * nivel...) y los dibuja como una pirámide: el nivel 1 arriba, solo, y cada
 * nivel siguiente en una fila más ancha debajo, conectados por una línea.
 */
export function PastorPyramid({ pastors }: { pastors: Pastor[] }) {
  const tiers = Array.from(new Set(pastors.map((pastor) => pastor.tier))).sort((a, b) => a - b);

  return (
    <div className="flex flex-col items-center">
      {tiers.map((tier, tierIndex) => (
        <div key={tier} className="flex flex-col items-center">
          {tierIndex > 0 && (
            <span
              className="h-10 w-px bg-gradient-to-b from-white/40 to-white/0 sm:h-14"
              aria-hidden="true"
            />
          )}
          <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-10 sm:gap-x-14">
            {pastors
              .filter((pastor) => pastor.tier === tier)
              .map((pastor) => (
                <PastorCard
                  key={pastor.slug}
                  pastor={pastor}
                  variant={tierIndex === 0 ? "lead" : "member"}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
