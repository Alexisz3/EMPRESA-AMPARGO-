import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Container } from "../ui/container";

const services = [
  {
    key: "remodeling",
    number: "01",
    image: "/images/services/bathroom-remodel.jpeg",
    imagePosition: "object-[50%_58%]",
  },
  {
    key: "construction",
    number: "02",
    image: "/images/services/patio-structure.jpeg",
    imagePosition: "object-[50%_46%]",
  },
  { key: "designPlanning", number: "03" },
  { key: "additional", number: "04" },
] as const;

const serviceAnchors = {
  remodeling: "remodeling",
  construction: "construction",
  designPlanning: "design-planning",
  additional: "additional-services",
} as const;

function ServicePlaceholder({ variant }: { variant: "designPlanning" | "additional" }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-full overflow-hidden bg-[#e8e2d8]"
    >
      {variant === "designPlanning" ? (
        <>
          <div className="absolute inset-x-[15%] top-[24%] h-px bg-accent/35" />
          <div className="absolute inset-x-[15%] bottom-[24%] h-px bg-accent/35" />
          <div className="absolute bottom-[24%] left-[25%] top-[24%] w-px bg-accent/35" />
          <div className="absolute bottom-[24%] right-[25%] top-[24%] w-px bg-accent/35" />
          <div className="absolute left-1/2 top-1/2 size-[38%] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-accent/45" />
        </>
      ) : (
        <>
          <div className="absolute left-[18%] top-[28%] h-[44%] w-[64%] rounded-full border border-accent/40" />
          <div className="absolute left-[27%] top-[37%] h-[26%] w-[46%] rounded-full border border-accent/40" />
          <div className="absolute left-1/2 top-[18%] h-[64%] w-px -translate-x-1/2 bg-accent/30" />
        </>
      )}
    </div>
  );
}

export async function Services() {
  const t = await getTranslations("Services");

  return (
    <section id="services" className="py-16 sm:py-24 lg:py-32">
      <Container>
        <div data-reveal className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-muted">
            {t("description")}
          </p>
        </div>

        <div
          data-services-grid
          data-reveal-group
          className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4 lg:mt-16"
        >
          {services.map((service) => (
            <article
              key={service.key}
              data-reveal
              className="service-card flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-black/10 bg-surface"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#e8e2d8] sm:aspect-[4/3]">
                {"image" in service ? (
                  <Image
                    src={service.image}
                    alt={t(`items.${service.key}.imageAlt`)}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, calc(100vw - 2.5rem)"
                    className={`object-cover ${service.imagePosition}`}
                  />
                ) : (
                  <ServicePlaceholder variant={service.key} />
                )}
              </div>

              <div className="flex flex-1 flex-col px-5 py-6 sm:px-6 sm:py-7">
                <span className="text-sm font-semibold tracking-[0.16em] text-accent">
                  {service.number}
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.025em]">
                  {t(`items.${service.key}.title`)}
                </h3>
                <p className="mt-3 flex-1 leading-7 text-muted">
                  {t(`items.${service.key}.description`)}
                </p>
                <Link
                  href={`/services#${serviceAnchors[service.key]}`}
                  className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:mt-7"
                >
                  {t("explore")} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
