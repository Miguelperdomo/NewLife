import type { MinistryAudience } from "@/lib/admin/types";

/** Solo lo necesario para describir la audiencia — sirve tanto para Ministry (público) como AdminMinistry. */
type MinistryLike = { slug: string; name: string };

export function describeAudience(audience: MinistryAudience, ministries: MinistryLike[]): string {
  if (audience.mode === "all") return "Todos los ministerios";
  if (audience.mode === "general") return "General (sin ministerio)";

  const names = audience.ministrySlugs
    .map((slug) => ministries.find((ministry) => ministry.slug === slug)?.name)
    .filter((name): name is string => Boolean(name));

  return names.length > 0 ? names.join(", ") : "Ministerios específicos";
}
