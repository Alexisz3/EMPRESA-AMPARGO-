import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Container } from "../ui/container";
import { PageCta } from "../sections/page-cta";

const categories = [
  { key: "remodeling", anchor: "remodeling", image: "/images/services/kitchen-remodeling.jpeg", items: 7 },
  { key: "construction", anchor: "construction", image: "/images/services/patio-construction-process.jpeg", items: 3 },
  { key: "designPlanning", anchor: "design-planning", items: 2 },
  { key: "additional", anchor: "additional-services", image: "/images/services/plumbing-installation.jpeg", items: 3 },
] as const;

function PlanningVisual() {
  return (
    <div aria-hidden="true" className="relative h-full overflow-hidden bg-[#e8e2d8]">
      <div className="absolute inset-[13%] border border-accent/35" />
      <div className="absolute left-[22%] top-[25%] h-[50%] w-px bg-accent/35" />
      <div className="absolute right-[24%] top-[13%] h-[74%] w-px bg-accent/35" />
      <div className="absolute inset-x-[13%] top-[38%] h-px bg-accent/35" />
      <div className="absolute inset-x-[13%] bottom-[28%] h-px bg-accent/35" />
      <div className="absolute left-[34%] top-[26%] size-[32%] rotate-45 border border-accent/45" />
    </div>
  );
}

export async function ServicesPageContent() {
  const t = await getTranslations("ServicesPage");

  return (
    <>
      <section className="bg-foreground py-16 text-background sm:py-24 lg:py-28">
        <Container>
          <div data-reveal="hero" className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d18a62]">{t("hero.eyebrow")}</p>
              <h1 className="mt-5 max-w-4xl text-[clamp(2.2rem,9.8vw,3rem)] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-white/65 sm:text-xl">{t("hero.description")}</p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 lg:py-32">
        <Container className="grid gap-16 sm:gap-20 lg:gap-28">
          {categories.map((category, index) => (
            <article id={category.anchor} key={category.key} data-reveal className="scroll-mt-24 grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-20">
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#e8e2d8] ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                {"image" in category ? (
                  <Image
                    src={category.image}
                    alt={t(`categories.${category.key}.imageAlt`)}
                    fill
                    sizes="(min-width: 1024px) 50vw, calc(100vw - 2.5rem)"
                    className={`object-cover ${
                      category.key === "construction" ? "object-[50%_48%]" : "object-center"
                    }`}
                  />
                ) : (
                  <PlanningVisual />
                )}
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <span className="text-sm font-semibold tracking-[0.16em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  {t(`categories.${category.key}.title`)}
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
                  {t(`categories.${category.key}.description`)}
                </p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: category.items }, (_, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-base font-medium">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {t(`categories.${category.key}.items.${itemIndex}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </Container>
      </section>

      <PageCta
        title={t("cta.title")}
        description={t("cta.description")}
        primaryLabel={t("cta.primary")}
        secondaryLabel={t("cta.secondary")}
      />
    </>
  );
}
