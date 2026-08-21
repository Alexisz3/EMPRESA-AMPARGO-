import { getTranslations } from "next-intl/server";

import { PageCta } from "../sections/page-cta";
import { Container } from "../ui/container";
import { ProjectsGallery, type ProjectGroup } from "./projects-gallery";

export async function ProjectsPageContent() {
  const t = await getTranslations("ProjectsPage");
  const makeImages = (group: string, files: string[]) => files.map((file, index) => ({ src: `/images/projects/${file}`, alt: t(`groups.${group}.images.${index}`) }));
  const groups: ProjectGroup[] = [
    { title: t("groups.outdoor.title"), description: t("groups.outdoor.description"), tag: t("groups.outdoor.tag"), images: makeImages("outdoor", ["outdoor-kitchen-03.jpeg", "outdoor-kitchen.jpeg", "outdoor-kitchen-02.jpeg"]) },
    { title: t("groups.bathroom.title"), description: t("groups.bathroom.description"), tag: t("groups.bathroom.tag"), images: makeImages("bathroom", ["bathroom-remodel.jpeg", "bathroom-remodel-02.jpeg"]) },
    { title: t("groups.patio.title"), description: t("groups.patio.description"), tag: t("groups.patio.tag"), images: makeImages("patio", ["patio-construction-01.jpeg", "patio-construction-02.jpeg", "patio-construction-03.jpeg"]) },
    { title: t("groups.kitchen.title"), description: t("groups.kitchen.description"), tag: t("groups.kitchen.tag"), images: makeImages("kitchen", ["kitchen-countertops-02.jpeg", "kitchen-countertops-01.jpeg", "kitchen-countertops-03.jpeg"]) },
    { title: t("groups.interior.title"), description: t("groups.interior.description"), tag: t("groups.interior.tag"), images: makeImages("interior", ["kitchen-countertops.jpeg", "interior-renovation.jpeg"]) },
    { title: t("groups.pool.title"), description: t("groups.pool.description"), tag: t("groups.pool.tag"), images: makeImages("pool", ["pool-construction-process.jpeg"]) },
  ];

  return (
    <>
      <section className="bg-foreground py-16 text-background sm:py-24 lg:py-32">
        <Container>
          <div data-reveal="hero">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-on-dark">{t("hero.eyebrow")}</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
            <h1 className="max-w-4xl text-[clamp(2.65rem,11.5vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-8xl">{t("hero.title")}</h1>
            <p className="max-w-xl text-lg leading-8 text-white/70">{t("hero.description")}</p>
          </div>
          </div>
        </Container>
      </section>
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div data-reveal className="mb-12 max-w-3xl sm:mb-28">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{t("intro.eyebrow")}</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{t("intro.title")}</h2>
            <p className="mt-6 text-lg leading-8 text-muted">{t("intro.description")}</p>
          </div>
          <ProjectsGallery groups={groups} closeLabel={t("lightbox.close")} nextLabel={t("lightbox.next")} previousLabel={t("lightbox.previous")} openLabel={t("lightbox.open")} />
        </Container>
      </section>
      <PageCta title={t("cta.title")} description={t("cta.description")} primaryLabel={t("cta.primary")} secondaryLabel={t("cta.secondary")} />
    </>
  );
}
