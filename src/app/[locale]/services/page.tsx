import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ServicesPageContent } from "@/components/pages/services-page-content";
import { getLocalizedMetadata } from "@/lib/seo";

type ServicesPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicesPage.metadata" });
  return getLocalizedMetadata(locale, "/services", t("title"), t("description"));
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main><ServicesPageContent /></main>
      <Footer />
    </>
  );
}
