import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { siteConfig } from "@/data/site";
import { buildOpenGraphMetadata } from "@/lib/seo";
import "./globals.css";

// Sin dominio propio todavía: NEXT_PUBLIC_SITE_URL queda pendiente de fijar
// el día que se publique el sitio (ver .env.local). Mientras tanto cae en
// localhost, que solo importa para pruebas locales de Open Graph.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  ...buildOpenGraphMetadata({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col bg-white text-slate-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
