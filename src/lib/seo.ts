import type { Metadata } from "next";

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return new URL(url.origin);
  } catch {
    return null;
  }
}

function getLocalizedAlternates(path: string, locale: string): Metadata["alternates"] | undefined {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return undefined;
  const normalized = path === "/" ? "" : path;
  const currentLocale = locale === "es" ? "es" : "en";
  return {
    canonical: new URL(`/${currentLocale}${normalized}`, siteUrl),
    languages: {
      en: new URL(`/en${normalized}`, siteUrl),
      es: new URL(`/es${normalized}`, siteUrl),
      "x-default": new URL(`/en${normalized}`, siteUrl),
    },
  };
}

export function getLocalizedMetadata(locale: string, path: string, title: string, description: string): Metadata {
  const siteUrl = getSiteUrl();
  const normalized = path === "/" ? "" : path;
  const currentLocale = locale === "es" ? "es" : "en";
  return {
    title,
    description,
    alternates: getLocalizedAlternates(path, currentLocale),
    openGraph: {
      type: "website",
      siteName: "AMPARGO",
      title,
      description,
      ...(siteUrl ? { url: new URL(`/${currentLocale}${normalized}`, siteUrl) } : {}),
    },
    twitter: { card: "summary", title, description },
  };
}
