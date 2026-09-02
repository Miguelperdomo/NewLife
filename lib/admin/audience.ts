import type { MinistryAudience } from "@/lib/admin/types";
import type { Ministry } from "@/lib/types";

export function describeAudience(audience: MinistryAudience, ministries: Ministry[]): string {
  if (audience.mode === "all") return "Todos los ministerios";
  if (audience.mode === "general") return "General (sin ministerio)";

  const names = audience.ministrySlugs
    .map((slug) => ministries.find((ministry) => ministry.slug === slug)?.name)
    .filter((name): name is string => Boolean(name));

  return names.length > 0 ? names.join(", ") : "Ministerios específicos";
}
