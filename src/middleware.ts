import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: true, // Enable automatic locale detection (optional)
});

export const config = {
  matcher: [
    // Match only paths that should be internationalized
    // Exclude API routes, Next.js internals, and static assets
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Match root path to redirect to default locale
    '/',
    // Match locale-prefixed paths to set locale cookie
    '/(en|fr)/:path*'
  ]
};