import type { ComponentType } from "react";
import type { SocialPlatform } from "@/lib/types";

/**
 * lucide-react retiró sus íconos de marca (Instagram, Facebook, YouTube, TikTok)
 * en la v1, así que las redes sociales usan glifos SVG propios y minimalistas.
 */
function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14 22v-8h2.7l.4-3.2H14V8.7c0-.93.26-1.56 1.6-1.56h1.7V4.3C17 4.24 15.94 4 14.72 4 12.16 4 10.4 5.57 10.4 8.4v2.4H7.7V14h2.7v8h3.6Z" />
    </svg>
  );
}

function YoutubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.6 7.7a2.7 2.7 0 0 0-1.9-1.9C18 5.3 12 5.3 12 5.3s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.7 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.3 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.3ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82c-.9-.63-1.5-1.62-1.66-2.75h-3.02v13.2c0 1.44-1.16 2.6-2.6 2.6a2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 2.6-2.6c.27 0 .53.04.77.11V10.7a5.6 5.6 0 0 0-.77-.06 5.62 5.62 0 1 0 5.62 5.63V9.4a8.6 8.6 0 0 0 4.66 1.37V7.75a5.5 5.5 0 0 1-2.99-1.93Z" />
    </svg>
  );
}

function WhatsappGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5A9.5 9.5 0 0 0 3.6 17l-1.1 4 4.1-1.1A9.5 9.5 0 1 0 12 2.5Zm0 17.3a7.7 7.7 0 0 1-3.9-1.07l-.28-.17-2.44.65.65-2.38-.18-.3A7.76 7.76 0 1 1 12 19.8Zm4.28-5.82c-.23-.12-1.37-.68-1.58-.76-.21-.08-.37-.12-.52.12-.15.23-.6.75-.74.91-.14.15-.27.17-.5.06-.23-.12-.98-.36-1.87-1.15-.69-.62-1.16-1.38-1.3-1.6-.13-.24-.01-.36.1-.48.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.15.04-.29-.02-.4-.06-.12-.52-1.25-.71-1.72-.19-.44-.38-.38-.52-.39h-.44c-.15 0-.4.06-.6.29-.21.24-.8.78-.8 1.9s.82 2.2.94 2.36c.11.15 1.61 2.46 3.9 3.45.55.24.97.38 1.31.48.55.17 1.04.15 1.44.09.44-.07 1.37-.56 1.56-1.1.19-.53.19-.99.14-1.09-.06-.1-.21-.16-.44-.28Z" />
    </svg>
  );
}

const icons: Record<SocialPlatform, ComponentType<{ className?: string }>> = {
  instagram: InstagramGlyph,
  facebook: FacebookGlyph,
  youtube: YoutubeGlyph,
  tiktok: TikTokGlyph,
  whatsapp: WhatsappGlyph,
};

export function SocialIcon({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  const Icon = icons[platform];
  return <Icon className={className} />;
}
