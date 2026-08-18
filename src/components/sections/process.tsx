import { getTranslations } from "next-intl/server";

import { Container } from "../ui/container";

const steps = ["consultation", "estimate", "planning", "construction", "completion"] as const;

export async function Process() {
  const t = await getTranslations("Process");

  return (
    <section id="process" className="py-16 sm:py-24 lg:py-32">
      <Container>
        <div data-reveal className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-muted">
            {t("description")}
          </p>
        </div>

        {/* Architectural line — reveals as section enters */}
        <span
          aria-hidden="true"
          data-reveal
          className="arch-line-h mt-10 block h-px w-full bg-foreground/12 lg:mt-14"
          style={{ "--line-delay": "80ms" } as React.CSSProperties}
        />

        <ol data-process-grid data-reveal-group className="mt-8 grid gap-x-6 gap-y-7 sm:grid-cols-2 sm:gap-y-10 lg:mt-10 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li
              key={step}
              data-reveal
              className="border-t border-black/15 pt-5 sm:pt-6"
              style={{ "--reveal-distance": "18px" } as React.CSSProperties}
            >
              <span className="text-sm font-semibold tracking-[0.16em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] sm:mt-5">
                {t(`steps.${step}.title`)}
              </h3>
              <p className="mt-2 leading-7 text-muted sm:mt-3">
                {t(`steps.${step}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
