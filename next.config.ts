import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import NextPWA from "@ducanh2912/next-pwa";

// Configure PWA
const withPWA = NextPWA({
  dest: "public", // Output directory for service worker and assets
  disable: process.env.NODE_ENV === "development", // Disable PWA in dev mode
  register: true, // Auto-register the service worker
  // Remove skipWaiting from top-level and configure via workbox if needed
  workboxOptions: {
    skipWaiting: true, // Move skipWaiting here if you need it
    clientsClaim: true, // Optional: Take control of clients immediately
  },
});

// Configure next-intl
const withNextIntl = createNextIntlPlugin();

// Define your Next.js config
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utopos.io",
      },
    ],
  
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
  // Add other config options here if needed
};

// Export the config with both plugins applied
export default withPWA(withNextIntl(nextConfig));