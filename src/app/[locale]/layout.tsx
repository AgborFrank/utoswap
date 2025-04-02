import { ReactNode } from "react";
import { Metadata } from "next";
import { Ruda, DM_Sans } from "next/font/google";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { notFound } from "next/navigation";
import ErrorFallback from "./components/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { ConfigProvider } from "antd";
import "../globals.css";
import { Providers } from "../../providers";
import { routing } from "../../i18n/routing";
import WagmiClientProvider from "./components/WagmiClientProvider";

// Fonts
const dmsans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

const ruda = Ruda({
  subsets: ["latin"],
  variable: "--font-ruda",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

const SUPPORTED_NAMESPACES = ["common"] as const;
type Namespace = typeof SUPPORTED_NAMESPACES[number];

// Viewport configuration
export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
  };
}

// Metadata with PWA enhancements
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? "en";

  return {
    title: "UTOP Token Bridge - Migrate V1/V2 to V3 on Polygon",
    description: "Easily bridge your UTOP tokens from V1 or V2 to V3 on the Polygon blockchain.",
    manifest: "/manifest.json", // Link to PWA manifest
    themeColor: "#000000", // Match your app's theme
    icons: {
      icon: "/assets/icons/icon-192x192.png", // Default icon
      apple: "/assets/icons/icon-192x192.png", // Apple touch icon
    },
    appleWebApp: {
      capable: true, // Enable standalone mode on iOS
      statusBarStyle: "black", // Match your theme
    },
    openGraph: {
      title: "UTOP Token Bridge",
      description: "Migrate your UTOP tokens to V3 on Polygon",
      locale: locale,
      type: "website",
    },
  };
}

const loadMessages = async (locale: string): Promise<Record<Namespace, AbstractIntlMessages>> => {
  const localeMessages: Partial<Record<Namespace, AbstractIntlMessages>> = {};

  try {
    await Promise.all(
      SUPPORTED_NAMESPACES.map(async (namespace) => {
        try {
          const messages = (await import(`../../../messages/${locale}/${namespace}.json`)).default;
          localeMessages[namespace] = messages;
        } catch (error) {
          console.error(`Failed to load ${namespace} for ${locale}:`, error);
          if (locale !== "en") {
            const fallbackMessages = (await import(`../../../messages/en/${namespace}.json`)).default;
            localeMessages[namespace] = fallbackMessages;
          } else {
            localeMessages[namespace] = {};
          }
        }
      })
    );
    return localeMessages as Record<Namespace, AbstractIntlMessages>;
  } catch (error) {
    console.error("Critical error loading messages:", error);
    throw new Error("Failed to load essential translations");
  }
};

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale ?? "en";

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = await loadMessages(locale);
  } catch (error) {
    console.error("Failed to load messages for locale:", locale, error);
    messages = await loadMessages("en");
  }

  return (
    <html lang={locale} data-theme="light">
      <head>
        <meta charSet="utf-8" />
        {/* PWA-specific meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="theme-color" content="#000000FF" />
        <link rel="apple-touch-icon" href="/assets/icons/icon-192x192.png" />
      </head>
      <body
        className={`${dmsans.variable} ${ruda.variable} antialiased bg-white`}
        suppressHydrationWarning
      >
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: "#e8c56b",
                algorithm: true,
              },
              Input: {
                colorPrimary: "#eb2f96",
                algorithm: true,
              },
            },
          }}
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <WagmiClientProvider>
                <Providers>{children}</Providers>
              </WagmiClientProvider>
            </NextIntlClientProvider>
          </ErrorBoundary>
        </ConfigProvider>
      </body>
    </html>
  );
}