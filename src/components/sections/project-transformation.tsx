import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Container } from "../ui/container";

const stages = ["framing", "roofing"] as const;

export async function ProjectTransformation() {
  const t = await getTranslations("ProjectTransformation");

  return (
    <section id="project-transformation" className="bg-foreground py-16 text-background sm:py-24 lg:py-32">
      <Container>
        <div data-reveal className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d18a62]">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-white/65">
            {t("description")}
          </p>
        </div>

        {/* Thin separator line */}
        <span
          aria-hidden="true"
          data-reveal
          className="arch-line-h mt-10 block h-px w-full bg-white/10 lg:mt-14"
          style={{ "--line-delay": "60ms" } as React.CSSProperties}
        />

        <div
          data-transformation-grid
          data-reveal-group
          className="mt-8 grid gap-4 md:grid-cols-2 lg:mt-10"
        >
          {stages.map((stage, stageIndex) => (
            <figure
              key={stage}
              data-reveal
              className="project-media group relative aspect-[16/10] min-w-0 overflow-hidden rounded-[1.75rem] bg-black/20 md:aspect-[4/3]"
              style={{ "--reveal-distance": "18px" } as React.CSSProperties}
            >
              <Image
                src={`/images/transformation/patio-${stage}.jpeg`}
                alt={t(`stages.${stage}.imageAlt`)}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className={`object-cover ${
                  stage === "framing" ? "object-[50%_50%]" : "object-[50%_48%]"
                }`}
              />
              <div
                data-project-overlay
                className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <div className="flex items-end justify-between">
                  <span className="inline-flex rounded-full bg-background px-4 py-2 text-sm font-semibold text-foreground">
                    {t(`stages.${stage}.label`)}
                  </span>
                  <span className="text-xs font-semibold tracking-[0.18em] text-white/40">
                    {String(stageIndex + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

