import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { LocaleScrollRestoration } from "@/components/layout/locale-navigation";
import { MotionObserver } from "@/components/ui/motion-observer";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateMetadata(): Metadata {
  const metadataBase = getSiteUrl();
  return {
    ...(metadataBase ? { metadataBase } : {}),
    title: { default: "AMPARGO", template: "%s | AMPARGO" },
    description: "Remodeling and construction services for residential and commercial projects in Houston, Texas.",
    openGraph: { type: "website", siteName: "AMPARGO" },
    twitter: { card: "summary" },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider>
          {children}
          <LocaleScrollRestoration />
        </NextIntlClientProvider>
        <MotionObserver />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
