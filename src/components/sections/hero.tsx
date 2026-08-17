import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Container } from "../ui/container";

const trustIndicators = ["experience", "serviceArea", "projectTypes"] as const;

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="overflow-hidden pb-12 pt-10 sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16">
          <div data-reveal="hero">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("eyebrow")}
            </p>
            <h1 className="max-w-3xl text-[clamp(2.65rem,11.5vw,3rem)] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-6xl xl:text-7xl">
              {t("title")}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              {t("description")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="motion-button inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 text-base font-semibold text-white hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("primaryCta")}
              </Link>
              <Link
                href="/projects"
                className="motion-button inline-flex min-h-12 items-center justify-center rounded-full border border-black/20 px-7 text-base font-semibold hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                {t("secondaryCta")}
              </Link>
            </div>
          </div>

          <div data-reveal="image">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] bg-[#25302c] text-white shadow-2xl shadow-black/15 sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="/images/outdoor-kitchen-hero.jpeg"
                alt={t("imageAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 46vw, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
                className="object-cover object-[52%_center] sm:object-[50%_center] lg:object-[54%_center]"
              />
            </div>
          </div>
        </div>

        <dl data-reveal className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:mt-12 sm:grid-cols-3 lg:mt-16">
          {trustIndicators.map((indicator, index) => (
            <div key={indicator} className={`bg-background px-5 py-5 sm:px-7 ${index === 2 ? "col-span-2 sm:col-span-1" : ""}`}>
              <dd className="text-base font-semibold text-foreground">
                {t(`trust.${indicator}.value`)}
              </dd>
              <dt className="mt-1 text-sm text-muted">
                {t(`trust.${indicator}.label`)}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
