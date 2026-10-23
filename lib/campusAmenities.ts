import { Accessibility, Baby, Car } from "lucide-react";
import type { ComponentType } from "react";
import type { Campus } from "@/lib/types";

export interface CampusAmenity {
  key: "hasParking" | "isWheelchairAccessible" | "hasChildcare";
  icon: ComponentType<{ className?: string }>;
  label: string;
  gradient: string;
}

/** Comodidades configurables por sede — compartido entre la página de cada campus y "Conócenos", que muestra las de la sede principal. */
export const CAMPUS_AMENITIES: CampusAmenity[] = [
  { key: "hasParking", icon: Car, label: "Parqueadero", gradient: "from-sky-500 to-blue-600" },
  { key: "isWheelchairAccessible", icon: Accessibility, label: "Accesible", gradient: "from-emerald-500 to-teal-600" },
  { key: "hasChildcare", icon: Baby, label: "Cuidado de niños", gradient: "from-rose-500 to-pink-600" },
];

export function activeCampusAmenities(campus: Pick<Campus, "hasParking" | "isWheelchairAccessible" | "hasChildcare">) {
  return CAMPUS_AMENITIES.filter((amenity) => campus[amenity.key]);
}
