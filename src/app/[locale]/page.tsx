import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { About } from "@/components/sections/about";
import { FinalCta } from "@/components/sections/final-cta";
import { FeaturedProjectsHome } from "@/components/sections/featured-projects-home";
import { Hero } from "@/components/sections/hero";
import { ProjectTransformation } from "@/components/sections/project-transformation";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { getLocalizedMetadata } from "@/lib/seo";


type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return getLocalizedMetadata(locale, "/", t("homeTitle"), t("homeDescription"));
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <FeaturedProjectsHome />
        <About />
        <ProjectTransformation />
        <Process />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
