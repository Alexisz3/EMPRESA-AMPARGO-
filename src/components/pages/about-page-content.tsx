import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Container } from "../ui/container";
import { PageCta } from "../sections/page-cta";

const approachItems = ["planning", "workmanship", "communication", "respect"] as const;
const values = ["trust", "quality", "reliability", "experience", "professionalism", "value"] as const;

const workImages = [
  { key: "bathroom", src: "/images/about/bathroom-tile-work.jpeg", className: "lg:col-span-7 lg:row-span-2" },
  { key: "structure", src: "/images/about/timber-structure-progress.jpeg", className: "lg:col-span-5" },
  { key: "kitchen", src: "/images/about/kitchen-installation.jpeg", className: "lg:col-span-3" },
  { key: "woodwork", src: "/images/about/custom-wood-detail.jpeg", className: "lg:col-span-2" },
] as const;

export async function AboutPageContent() {
  const t = await getTranslations("AboutPage");

  return (
    <>
      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div data-reveal="hero">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                {t("hero.eyebrow")}
              </p>
              <h1 className="mt-5 max-w-3xl text-[clamp(2.65rem,11.5vw,3rem)] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {t("hero.title")}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                {t("hero.description")}
              </p>
            </div>
            <div data-reveal="image" className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#ded8cc] sm:aspect-[16/10] lg:aspect-[4/5]">
              <Image
                src="/images/about/pool-construction-progress.jpeg"
                alt={t("hero.imageAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover object-[50%_48%]"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-black/10 py-16 sm:py-20">
        <Container>
          <div data-reveal className="grid gap-8 md:grid-cols-[0.42fr_1fr] md:items-center lg:gap-20">
            <div className="flex items-end gap-5">
              <span className="text-7xl font-semibold leading-none tracking-[-0.06em] text-accent lg:text-8xl">
                30+
              </span>
              <span className="max-w-32 pb-2 font-semibold leading-6">
                {t("experience.label")}
              </span>
            </div>
            <p className="max-w-3xl text-xl leading-9 text-muted">
              {t("experience.description")}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-foreground py-16 text-background sm:py-24 lg:py-28">
        <Container>
          <div data-reveal className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-on-dark">
              {t("approach.eyebrow")}
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t("approach.title")}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              {t("approach.description")}
            </p>
          </div>
          <div data-reveal-group className="mt-12 grid gap-x-6 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:mt-16 lg:grid-cols-4">
            {approachItems.map((item, index) => (
              <article key={item} data-reveal className="border-t border-white/20 pt-6">
                <span className="text-sm font-semibold tracking-[0.16em] text-accent-on-dark">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl font-semibold">{t(`approach.items.${item}.title`)}</h3>
                <p className="mt-3 leading-7 text-white/60">{t(`approach.items.${item}.description`)}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 lg:py-28">
        <Container>
          <div data-reveal className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                {t("values.eyebrow")}
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
                {t("values.title")}
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-muted">{t("values.description")}</p>
          </div>
          <div data-reveal-group className="mt-12 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <article key={value} data-reveal className="border-t border-black/15 pt-6">
                <h3 className="text-xl font-semibold">{t(`values.items.${value}.title`)}</h3>
                <p className="mt-3 leading-7 text-muted">{t(`values.items.${value}.description`)}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#ece7dd] py-16 sm:py-24 lg:py-28">
        <Container>
          <div data-reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{t("work.eyebrow")}</p>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
            {t("work.title")}
          </h2>
          </div>
          <div data-reveal-group className="mt-12 grid gap-4 md:grid-cols-2 lg:h-[650px] lg:grid-cols-12 lg:grid-rows-2">
            {workImages.map((image) => (
              <figure
                key={image.key}
                data-reveal="image"
                className={`relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-black/10 sm:aspect-[4/3] lg:aspect-auto ${image.className}`}
              >
                <Image
                  src={image.src}
                  alt={t(`work.images.${image.key}`)}
                  fill
                  sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, calc(100vw - 2.5rem)"
                  className="object-cover"
                />
              </figure>
            ))}
          </div>
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
