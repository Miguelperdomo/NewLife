import { Baby, Flame, Globe, Hand, HandHeart, Music, Shield, Sparkles, Sun } from "lucide-react";

export function MinistryIcon({ slug, className }: { slug: string; className?: string }) {
  switch (slug) {
    case "jovenes":
      return <Flame className={className} aria-hidden="true" />;
    case "ninos":
      return <Baby className={className} aria-hidden="true" />;
    case "alabanza":
      return <Music className={className} aria-hidden="true" />;
    case "mujeres":
      return <Sparkles className={className} aria-hidden="true" />;
    case "hombres":
      return <Shield className={className} aria-hidden="true" />;
    case "voluntariado":
      return <HandHeart className={className} aria-hidden="true" />;
    case "maravillosos":
      return <Sun className={className} aria-hidden="true" />;
    case "intercesion":
      return <Hand className={className} aria-hidden="true" />;
    case "life-missions":
      return <Globe className={className} aria-hidden="true" />;
    default:
      return <Sparkles className={className} aria-hidden="true" />;
  }
}
