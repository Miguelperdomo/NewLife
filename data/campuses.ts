import type { Campus } from "@/lib/types";

export const campuses: Campus[] = [
  {
    slug: "principal",
    name: "Sede Principal",
    fullName: "Iglesia New Life Church",
    address: "Carrera 19D Sur #118-18, Ibagué, Tolima",
    // Plus code (más preciso que la dirección para ubicar el punto en el mapa).
    mapQuery: "CR4P+QG Ibagué, Tolima",
    imageSrc: "/sedes/principal.jpg",
    imageLabel: "Fachada de la sede principal de New Life Church",
    isMain: true,
  },
  {
    slug: "vasconia",
    name: "Sede Vasconia",
    fullName: "New Life Church Vasconia",
    address: "Casa 3, Vasconia, Manzana G, Ibagué, Tolima",
    mapQuery: "Casa 3 Vasconia Mz G, Ibagué, Tolima",
    imageLabel: "[FOTOGRAFÍA SEDE VASCONIA]",
    isMain: false,
  },
];
