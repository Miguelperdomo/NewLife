import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Fotos subidas desde el panel admin (Supabase Storage, bucket "media").
      // El comodín cubre cualquier proyecto de Supabase, no solo el actual.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Imágenes pegadas como link externo (ver ImageUploadField "o pega un
      // enlace") — cualquier dominio https, a propósito: no hay forma de
      // adivinar de antemano dónde va a estar alojada una foto que alguien
      // encuentra en Google. Sin optimización automática para esas (no son
      // de Supabase), pero sí se muestran sin romper el sitio.
      { protocol: "https", hostname: "**" },
    ],
  },

  // Cabeceras de seguridad aplicadas a todo el sitio. `frame-ancestors 'none'`
  // + X-Frame-Options bloquean que /admin/login (o cualquier página) se
  // esconda dentro de un <iframe> de otro sitio para engañar a alguien
  // (clickjacking). No se agrega un Content-Security-Policy más estricto a
  // propósito: Analytics/Meta Pixel/YouTube/Google Maps/Supabase necesitan
  // scripts e iframes de terceros, y restringirlos mal rompería el sitio.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none';" },
        ],
      },
    ];
  },
};

export default nextConfig;
