import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import JsonLd from "@/components/seo/JsonLd";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import { SITE } from "@/lib/constants";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Restobar Premium Puerto Montt`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "restobar Puerto Montt",
    "hamburguesas Puerto Montt",
    "tablas Puerto Montt",
    "bar Puerto Montt",
    "restaurante Puerto Montt",
    "comida a domicilio Puerto Montt",
    "Balu Restobar",
    "cócteles Puerto Montt",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.slogan}`,
    description: SITE.description,
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE.url },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <JsonLd />
      </head>
      <body
        className={`${display.variable} ${sans.variable} font-sans antialiased bg-balu-dark text-neutral-100 transition-colors duration-300`}
      >
        <GoogleAnalytics />
        <ServiceWorkerRegister />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
