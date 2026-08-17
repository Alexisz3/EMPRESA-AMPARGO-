import { getTranslations } from "next-intl/server";

import { Container } from "../ui/container";

const reasons = ["experience", "quality", "reliability", "versatility"] as const;

export async function WhyChooseUs() {
  const t = await getTranslations("WhyChooseUs");

  return (
    <section id="why-choose-us" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-muted">
            {t("description")}
          </p>
        </div>

        <div data-reasons-grid className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <article key={reason} className="border-t border-black/15 pt-6">
              <span className="text-sm font-semibold tracking-[0.16em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.025em]">
                {t(`items.${reason}.title`)}
              </h3>
              <p className="mt-3 leading-7 text-muted">
                {t(`items.${reason}.description`)}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
