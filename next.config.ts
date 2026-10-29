import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // fotos subidas desde el admin (Supabase Storage, bucket "media")
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // imágenes pegadas como link externo — cualquier https, no hay forma de
      // saber de antemano el dominio. No se optimizan pero igual se muestran.
      { protocol: "https", hostname: "**" },
    ],
  },

  // cabeceras de seguridad para todo el sitio — frame-ancestors + X-Frame-Options
  // evitan que metan el sitio en un iframe ajeno (clickjacking). No se puso un
  // CSP más estricto porque rompería Analytics/Meta Pixel/YouTube/Maps/Supabase
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
