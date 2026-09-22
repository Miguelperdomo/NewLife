import { Clock, Gift, HandCoins, HandHeart, Heart, Lightbulb, Shirt, UtensilsCrossed } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Íconos disponibles para las opciones del widget de Ayuda y donaciones —
 * mismo patrón que lib/firstTimeIcons.ts (catálogo fijo, no cualquier ícono).
 */
export const HELP_OPTION_ICON_OPTIONS = [
  { value: "handCoins", label: "Donación económica", icon: HandCoins },
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
