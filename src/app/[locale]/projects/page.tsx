import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ProjectsPageContent } from "@/components/pages/projects-page-content";
import { getLocalizedMetadata } from "@/lib/seo";

type ProjectsPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProjectsPage.metadata" });
  return getLocalizedMetadata(locale, "/projects", t("title"), t("description"));
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <><Header activePage="projects" /><main><ProjectsPageContent /></main><Footer /></>;
}
