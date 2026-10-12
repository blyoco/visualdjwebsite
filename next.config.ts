import type { NextConfig } from "next";

// Statische export: `npm run build` zet de hele site als losse bestanden in `out/`.
// Zo kan hij gratis op Cloudflare draaien, zonder server (net als balai.music).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    // De CSS komt direct in de pagina, zodat bezoekers niet op een los stijlbestand wachten.
    inlineCss: true,
  },
};

export default nextConfig;
