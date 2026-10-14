import { Clock, Gift, HandHeart, Heart, Lightbulb, Shirt, UtensilsCrossed } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Íconos disponibles para las opciones del widget de Ayuda — mismo patrón
 * que lib/firstTimeIcons.ts (catálogo fijo, no cualquier ícono). La donación
 * NO está aquí a propósito: tiene su propia sección (Configuración >
 * Donaciones) que se conecta sola con los datos bancarios/Nequi/Daviplata —
 * agregarla aquí crearía una "donación" falsa que solo manda un WhatsApp.
 */
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
