import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AboutPageContent } from "@/components/pages/about-page-content";
import { getLocalizedMetadata } from "@/lib/seo";

type AboutPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage.metadata" });
  return getLocalizedMetadata(locale, "/about", t("title"), t("description"));
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header activePage="about" />
      <main><AboutPageContent /></main>
      <Footer />
    </>
  );
}
