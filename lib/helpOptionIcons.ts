import { Clock, Gift, HandHeart, Heart, Lightbulb, Shirt, UtensilsCrossed } from "lucide-react";
import type { ComponentType } from "react";

// Mismo patrón que lib/firstTimeIcons.ts. Ojo: la donación NO va aquí, tiene
// su propia sección en Configuración (banco/Nequi/Daviplata) — meterla acá
// sería una "donación" falsa que solo abre WhatsApp.
export const HELP_OPTION_ICON_OPTIONS = [
  { value: "shirt", label: "Ropa", icon: Shirt },
  { value: "food", label: "Alimentos", icon: UtensilsCrossed },
  { value: "gift", label: "Artículos/especie", icon: Gift },
  { value: "clock", label: "Tiempo/voluntariado", icon: Clock },
  { value: "lightbulb", label: "Talento/habilidades", icon: Lightbulb },
  { value: "heart", label: "General", icon: Heart },
  { value: "handHeart", label: "Ayuda (otro)", icon: HandHeart },
] as const;

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = Object.fromEntries(
  HELP_OPTION_ICON_OPTIONS.map((option) => [option.value, option.icon])
);

export function getHelpOptionIcon(key: string): ComponentType<{ className?: string }> {
  return ICON_MAP[key] ?? HandHeart;
}
