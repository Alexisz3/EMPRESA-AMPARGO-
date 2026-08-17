import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Container } from "../ui/container";

const stages = ["framing", "roofing"] as const;

export async function ProjectTransformation() {
  const t = await getTranslations("ProjectTransformation");

  return (
    <section id="project-transformation" className="bg-foreground py-20 text-background sm:py-24 lg:py-32">
      <Container>
        <div className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:gap-16">
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

        <div data-transformation-grid className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16">
          {stages.map((stage) => (
            <figure
              key={stage}
              className="group relative aspect-[4/3] min-w-0 overflow-hidden rounded-[1.75rem] bg-black/20"
            >
              <Image
                src={`/images/transformation/patio-${stage}.jpeg`}
                alt={t(`stages.${stage}.imageAlt`)}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className={`object-cover transition-transform duration-500 ease-out lg:group-hover:scale-[1.02] ${
                  stage === "framing" ? "object-[50%_50%]" : "object-[50%_48%]"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <span className="inline-flex rounded-full bg-background px-4 py-2 text-sm font-semibold text-foreground">
                  {t(`stages.${stage}.label`)}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
