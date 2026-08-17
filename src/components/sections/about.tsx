import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Container } from "../ui/container";

const values = ["quality", "reliability", "versatility"] as const;

export async function About() {
  const t = await getTranslations("About");

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
          <div data-reveal="image" className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#ded8cc] sm:aspect-[16/10] lg:aspect-[4/5]">
            <Image
              src="/images/about/timber-patio-framing.jpeg"
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[50%_43%]"
            />
          </div>

          <div data-reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted">
              {t("description")}
            </p>

            <div className="mt-10 flex items-end gap-5 border-y border-black/10 py-7 sm:gap-7">
              <span className="text-6xl font-semibold leading-none tracking-[-0.06em] text-accent sm:text-7xl">
                {t("stat.value")}
              </span>
              <span className="max-w-32 pb-1 text-base font-semibold leading-6 text-foreground">
                {t("stat.label")}
              </span>
            </div>

            <Link
              href="/about"
              className="mt-9 inline-flex min-h-11 w-fit items-center gap-2 text-base font-semibold text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {t("cta")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div
          data-about-values
          data-reveal-group
          className="mt-10 border-y border-black/10 sm:mt-14 sm:grid sm:grid-cols-3 lg:mt-16"
        >
          {values.map((value, index) => (
            <article
              key={value}
              data-reveal
              className={`grid grid-cols-[6.25rem_1fr] gap-5 py-5 sm:block sm:px-7 sm:py-7 lg:px-9 ${
                index === 0
                  ? "sm:pl-0 lg:pl-0"
                  : "border-t border-black/10 sm:border-l sm:border-t-0"
              }`}
            >
              <h3 className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">
                {t(`values.${value}.title`)}
              </h3>
              <p className="text-sm leading-6 text-muted sm:mt-3 sm:text-base sm:leading-7">
                {t(`values.${value}.description`)}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
