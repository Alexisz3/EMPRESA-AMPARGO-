import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PrivacyPageContent } from "@/components/pages/privacy-page-content";
import { getLocalizedMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPage.metadata" });
  return getLocalizedMetadata(locale, "/privacy", t("title"), t("description"));
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <><Header /><main><PrivacyPageContent /></main><Footer /></>;
}
