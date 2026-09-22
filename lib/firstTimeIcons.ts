import { Baby, Car, Clock, Coffee, HandHeart, Heart, MapPin, Music2, Shield, Shirt, Sparkles, Users } from "lucide-react";
import type { ComponentType } from "react";

/**
 * Íconos disponibles para las tarjetas de "¿Es tu primera vez?" — un
 * catálogo fijo (no cualquier ícono) para que el selector en el admin sea
 * simple, y para que el sitio público sepa siempre qué dibujar sin depender
 * de que alguien escriba el nombre exacto de un ícono a mano.
 */
export const FIRST_TIME_ICON_OPTIONS = [
  { value: "sparkles", label: "Destello (general)", icon: Sparkles },
  { value: "baby", label: "Bebé (niños)", icon: Baby },
  { value: "car", label: "Carro (parqueadero)", icon: Car },
  { value: "clock", label: "Reloj (horarios)", icon: Clock },
  { value: "heart", label: "Corazón (bienvenida)", icon: Heart },
  { value: "shirt", label: "Camisa (vestimenta)", icon: Shirt },
  { value: "coffee", label: "Café (hospitalidad)", icon: Coffee },
  { value: "mapPin", label: "Ubicación", icon: MapPin },
  { value: "users", label: "Personas (comunidad)", icon: Users },
  { value: "handHeart", label: "Ayuda", icon: HandHeart },
  { value: "shield", label: "Seguridad", icon: Shield },
  { value: "music", label: "Música (alabanza)", icon: Music2 },
] as const;

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = Object.fromEntries(
  FIRST_TIME_ICON_OPTIONS.map((option) => [option.value, option.icon])
);

export function getFirstTimeIcon(key: string): ComponentType<{ className?: string }> {
  return ICON_MAP[key] ?? Sparkles;
}
