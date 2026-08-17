import { getTranslations } from "next-intl/server";

import { EstimateForm } from "../forms/estimate-form";
import { Container } from "../ui/container";

export async function QuotePageContent() {
  const t = await getTranslations("QuotePage");
  return (
    <>
      <section className="bg-foreground py-16 text-background sm:py-24 lg:py-28">
        <Container>
          <div data-reveal="hero">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d18a62]">{t("hero.eyebrow")}</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
            <h1 className="max-w-4xl text-[clamp(2.65rem,11.5vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">{t("hero.title")}</h1>
            <p className="max-w-xl text-lg leading-8 text-white/70 sm:text-xl">{t("hero.description")}</p>
          </div>
          </div>
        </Container>
      </section>
      <section className="py-16 sm:py-20 lg:py-28">
        <Container>
          <div data-reveal className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{t("form.title")}</h2>
            <p className="mt-4 text-lg leading-8 text-muted">{t("form.intro")}</p>
          </div>
          <EstimateForm />
        </Container>
      </section>
    </>
  );
}
