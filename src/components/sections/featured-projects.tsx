import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Container } from "../ui/container";

type ProjectImageProps = {
  alt: string;
  className?: string;
  imageClassName?: string;
  label: string;
  sizes: string;
  src: string;
};

function ProjectImage({
  alt,
  className = "",
  imageClassName = "object-center",
  label,
  sizes,
  src,
}: ProjectImageProps) {
  return (
    <figure
      data-reveal
      className={`project-media group relative min-h-0 overflow-hidden rounded-[1.5rem] bg-black/20 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
      />
      <div data-project-overlay className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <span className="text-lg font-semibold tracking-[-0.015em] text-white sm:text-xl">
          {label}
        </span>
      </figcaption>
    </figure>
  );
}

export async function FeaturedProjects() {
  const t = await getTranslations("FeaturedProjects");

  return (
    <section id="featured-projects" className="bg-foreground py-16 text-background sm:py-24 lg:py-32">
      <Container>
        <div data-reveal className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d18a62]">
              {t("eyebrow")}
            </p>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              {t("description")}
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex w-fit items-center gap-2 text-base font-semibold text-white underline-offset-4 transition-colors hover:text-[#d18a62] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {t("viewAll")} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div data-projects-grid data-reveal-group className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:h-[720px] lg:grid-cols-12 lg:grid-rows-2">
          <ProjectImage
            src="/images/projects/outdoor-kitchen.jpeg"
            alt={t("items.outdoorKitchen.imageAlt")}
            label={t("items.outdoorKitchen.title")}
            sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw"
            imageClassName="object-[50%_52%]"
            className="aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto"
          />

          <ProjectImage
            src="/images/projects/interior-renovation.jpeg"
            alt={t("items.interiorRenovation.imageAlt")}
            label={t("items.interiorRenovation.title")}
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw"
            imageClassName="object-[50%_58%]"
            className="aspect-[4/3] lg:col-span-5 lg:aspect-auto"
          />

          <ProjectImage
            src="/images/projects/bathroom-remodel.jpeg"
            alt={t("items.bathroomRemodel.imageAlt")}
            label={t("items.bathroomRemodel.title")}
            sizes="(min-width: 1024px) 17vw, (min-width: 768px) 50vw, 100vw"
            imageClassName="object-[50%_58%]"
            className="aspect-[4/3] lg:col-span-2 lg:aspect-auto"
          />
          <ProjectImage
            src="/images/projects/kitchen-countertops.jpeg"
            alt={t("items.kitchenCountertops.imageAlt")}
            label={t("items.kitchenCountertops.title")}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            imageClassName="object-[48%_50%]"
            className="aspect-[4/3] lg:col-span-3 lg:aspect-auto"
          />
        </div>
      </Container>
    </section>
  );
}
